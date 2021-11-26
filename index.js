// @ts-check

const regions = require('./regions.json');
const storageAccounts = require('./storageAccounts.json');
const haversineDistance = require('./haversineDistance');

function getRegionsNearestFirst(request) {
  return regions
    .map((region) => ({ region, distance: haversineDistance(region, request.cf) }))
    .sort((a, b) => a.distance - b.distance)
    .map(({ region }) => region.id);
}

/**
 * @param {string[]} regions
 * @returns {Promise<{ id: string; latency: number }[]>}
 */
async function getRegionsLatencies(regions) {
  const results = [];

  await Promise.all(regions.map(async (region) => {
    /** @type {any} */
    let storageAccount = storageAccounts.find(account => account.id === region);
    if (!storageAccount) {
      const secondaryStorageAccount = storageAccounts.find(account => account.secondary.id === region);
      if (secondaryStorageAccount) {
        storageAccount = secondaryStorageAccount.secondary;
      }
    }
    const startTime = Date.now();
    try {
      await fetch(storageAccount.url);
      results.push({
        id: region,
        latency: Date.now() - startTime,
        // isSecondary: !('secondary' in storageAccount),
      });
    } catch {
      // noop
    }
  }));

  return results;
}

async function handleRequest(request) {
  const url = new URL(request.url);

  const testRegions = url.searchParams.has('regions')
    ? url.searchParams.get('regions').split(',').slice(0, 5)
    : getRegionsNearestFirst(request).slice(0, 6);

  const testAttempts = url.searchParams.has('attempts')
    ? Math.min(5, Math.max(1, +url.searchParams.get('attempts')))
    : 2; // default to 2 to allow for a pre-connect attempt (warms the tcp connection)

  /** @type {{ id: string; latency: number }[][]} */
  const attempts = [];

  for (let i = 0; i < testAttempts; i++) {
    attempts.push(await getRegionsLatencies(testRegions));
  }

  const quickestAttempts = testRegions.map((region) => {
    let quickestAttempt = null;
    let quickestLatency = Infinity;

    for (const attempt of attempts) {
      const regionAttempt = attempt.find(attempt => attempt.id === region);
      if (regionAttempt) {
        if (regionAttempt.latency < quickestLatency) {
          quickestAttempt = regionAttempt;
          quickestLatency = regionAttempt.latency;
        }
      }
    }

    return quickestAttempt;
  }).filter(Boolean);

  const response = quickestAttempts.map((result) => {
    const region = regions.find(region => region.id === result.id);
    return {
      id: region.id,
      group: region.group,
      name: region.name,
      location: region.location,
      distance: Math.floor(haversineDistance(region, request.cf) / 1000),
      latency: result.latency,
    };
  }).sort((a, b) => a.latency - b.latency);

  return new Response(JSON.stringify(response, null, '  '), {
    headers: {
      'access-control-allow-origin': '*',
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

addEventListener('fetch', (event) => {
  event.respondWith(
    handleRequest(event.request).catch((err) => (
      new Response(err.stack, { status: 500 })
    ))
  );
});
