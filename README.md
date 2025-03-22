# DoubleD Proxmox VE Card
[![Author](https://img.shields.io/badge/author-DoubleD--SmartHome-blue)](https://github.com/DoubleD-SmartHome)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://hacs.xyz)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/DoubleD-SmartHome/DD-ProxmoxVE-Card)

![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/DoubleD-SmartHome/DD-ProxmoxVE-Card/total?)


This repository contains a Home Assistant custom card for a Proxmox VE Integration, with a few other misc indicators. 
<br>
![Default](card_1.0.png)

## Minimum Home Assistant version
Home Assistant Core version `2025.3.3` to `2025.3.3` is required.

## Installation`

Add this repository `https://github.com/DoubleD-SmartHome/DD-ProxmoxVE-Card/` as a HACS custom repositories using type `Dashboard`

## Usage

Here's a breakdown of all the available configuration items:

| Name          | Optional	| Default	  | Description                            | Values
|---------------|-----------|-----------|----------------------------------------|--------------------------------------------------------------------------------------------
| type          | N         |           | Custom card type id                    | `custom:df-proxmox-card`
| device        | N         |           | Home Assistant device name             | `HA device name`
| logo          | N         |           | Card logo                              | `linux`, `frigate`, `homeassistant`, `nextcloud`, `rpd`, `vaultwarden`        
| ssl           | Y         |           | Entity ID for SSL Expiry Date *        | `sensor.<name>`
| backup        | Y         |           | Entity ID for Last Backup Date         | `sensor.<name>`
| console       | Y         |           | Entity ID for Console Check            | `sensor.<name>`.
| stats         | Y         |           | Stats Group                            | n/a
|   - stat      | Y         |           | Stat type (can be used up to 6 times   | `cpu_used`, `disk_used_percentage`, `memory_used_percentage`, `network_in`, `network_out`

\* Tested using Home Assistant's `Certificate Expiry` integration

## example
```yaml
type: custom:df-proxmox-card
device: lxc_base_local_101
logo: linux
ssl: sensor.www_ha_mydomain_com_8123_cert_expiry
stats:
  - stat: cpu_used
  - stat: memory_used_percentage
```
