# DoubleD Proxmox VE Card

`Tested with HA version 2025.3.3`

This repository contains a Home Assistant custom card for a Proxmox VE Integration, with a few other misc indicators. 
![Default](card_1.0.png)

## Installation

## Usage

Here's a breakdown of all the available configuration items:

| Name          | Optional	| Default	  | Description                            | Values
|---------------|-----------|-----------|----------------------------------------|----------------------------------------------------------------------
| type          | N         |           | Custom card type id                    | `custom:df-proxmox-card`
| device        | N         |           | Home Assistant device name             | `HA device name`
| logo          | N         |           | Card logo                              | `linux`, `frigate`, `homeassistant`, `nextcloud`, `rpd`, `vaultwarden`        
| ssl           | Y         |           | Entity ID for SSL Expiry Date          | `sensor.<name>`

## example
```yaml
type: custom:df-proxmox-card
device: lxc_base_local_101
logo: linux
ssl: sensor.dev_ha_doubled_demersfamily_cc_9999_cert_expiry
```
