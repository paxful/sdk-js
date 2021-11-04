name: Paxful Javascript SDK
on:
  push:
    branches:
      - master
    tags:
      - "v*"
  pull_request:
    branches: [ master ]
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 12.x
        uses: actions/setup-node@v2
        with:
          node-version: 12.x
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
        env:
          PAXFUL_OAUTH_HOST: ${{ secrets.PAXFUL_OAUTH_HOST }}
          PAXFUL_DATA_HOST: ${{ secrets.PAXFUL_DATA_HOST }}
          PAXFUL_CLIENT_ID: ${{ secrets.PAXFUL_CLIENT_ID }}
          PAXFUL_CLIENT_SECRET: ${{ secrets.PAXFUL_CLIENT_SECRET }}
          SELLER_CLIENT_ID: ${{ secrets.SELLER_CLIENT_ID }}
          SELLER_CLIENT_SECRET: ${{ secrets.SELLER_CLIENT_SECRET }}
          BUYER_CLIENT_ID: ${{ secrets.BUYER_CLIENT_ID }}
          BUYER_CLIENT_SECRET: ${{ secrets.BUYER_CLIENT_SECRET }}
      - run: echo "🎉 Tests completed."
  deploy:
    name: Publish
    if: ${{ startsWith(github.ref, 'refs/tags/') }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 12.x
        uses: actions/setup-node@v2
        with:
          node-version: 12.x
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build --if-present
      - name: Set output
        id: vars
        run: echo ::set-output name=tag::${GITHUB_REF#refs/*/v}
      - run: npm version $RELEASE_VERSION --no-git-tag-version
        env:
          RELEASE_VERSION: ${{ steps.vars.outputs.tag }}
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
