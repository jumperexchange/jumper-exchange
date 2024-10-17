module.exports = {
  ci: {
    assert: {
      // Use recommended audits, including PWA tests
      preset: "lighthouse:recommended"
    },
    upload: {
      // Returns a URL which will be valid for a few days
      // and accessible to anyone with the link
      "target": "temporary-public-storage"
    },
    collect: {
      url: [
        // A list of URLs to test
        "http://localhost:3000",
        "http://localhost:3000/gas",
        "http://localhost:3000/learn",
        "http://localhost:3000/profile",
        "http://localhost:3000/scan",
      ],
      startServerCommand: 'node .next/standalone/server.js',
      startServerReadyPattern: "ready on",
      numberOfRuns: 1,
      settings: {
        // Switch between desktop and mobile emulation
        preset: "desktop"
      }
    }
  },
};
