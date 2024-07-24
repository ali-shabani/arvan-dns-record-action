# Arvan DNS Record Actions V1

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This GitHub Action enables you to synchronize your DNS records with
[Arvan CDN](https://panel.arvancloud.ir/cdn). It's designed to automate the
management of your DNS records, ensuring they are always up to date with your
specifications.

## Usage

To use this action, add the following step to your GitHub Actions workflow:

```yaml
- uses: ali-shabani/arvan-dns-record-action@v1
  with:
    # Arvan API KEY
    # Create one from here: https://panel.arvancloud.ir/profile/machine-user
    # Ensure the generated API key has access to CDN
    api_key: ''

    # The domain you wish to manage
    domain: ''

    # Path to the JSON file containing your DNS records
    # The path should be relative to ${{ GITHUB_WORKSPACE }}
    file: ''
```

## JSON File Format

You need to create a JSON file containing an array of objects. Each object
should match the body format expected by the Arvan CDN DNS Management
[API endpoint](https://www.arvancloud.ir/api/cdn/4.0#tag/DNS-Management/operation/dns-records.store).

For a sample JSON file format, refer to this
[example](https://www.arvancloud.ir/api/cdn/4.0#tag/DNS-Management/operation/dns-records.store).
