## Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Setup](#-setup)
- [Usage](#-usage)
- [How Data is Added](#-how-data-is-added)

## About

**Pantry.io** is an intelligent pantry inventory management application, desgined track which ingredients you have and only serve you recipes that you have the ingredients to cook. All you need to do is scan your groceries, and **pantry.io** takes care of the rest.

## Key Features

- **Identity Mapping**: Groups ingredients of different brands/sizes under a singe "generic identity"
- **Local-First & Privacy-Focused**: No cloud required. All data stays on your hardware in your home
- **Easy to Use**: Just scan the barcodes on your groceries to add them and talk to an LLM to decide on what you want to eat.
- **Ready-to-make Recipes**: Pantry.io only shows you recipes you can make right now, no need to go searching through your pantry to check stock anymore.

## System Architecture

To ensure the application remains lightning-fast, it utilizes a **Core/Interface** hardware split.

| Component | Responsibility | Recommended Hardware |
|-----|-----|-----|
| **The Core** | API interaction, database queries, LLM chatbot | Desktop Gaming PC/Home Server |
| The Interface | Barcode scanning, Recipe viewing, UI | Tablet / Raspberry Pi / Phone |

## Setup

---

### Software Setup

#### 1. Prerequisites
* **Node.js** (Latest version)
* **Local network access** between your Core and Interface devices

#### 2. Installation (on Core device)
```bash
# Clone the repository
git clone [https://github.com/tysenh1/pantry.io](https://github.com/tysenh1/pantry.io.git)
cd pantry.io

# Install dependencies
pnpm install

# Generate local SSL (Required for camera access over local networks)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem sha256 -days 365
```

#### 3. Launch (on Core device)

```bash
# Start both applications 
pnpm dev
```

### Hardware Build Guide

**Coming Soon...**
I'm still researching parts to buy and where to get them.

This section will include:
* **Bill of Materials**: Recommended touchscreens, enclosures, and devices.
* **CAD Files**: Custom case models for all of the components.
* **Assembly Instructions**: Step-by-step instructions to assemble the Interface portion with the parts listed here.
* **OS Configuration**: Scripts for setting up the Interface to act like a dedicated "Kiosk Mode" display.

## Usage

Simply make sure the application is running on your Core device, and then boot up your Interface device. The two should automatically connect.

## How Data is Added

Pantry.io is designed to fetch information from the internet only when required. When you scan an item, the application follows a simple process:

### 1. Internal Lookup

The system first queries your local database to check if you've scanned the item before. If you've scanned an item with a barcode that exists in the system, it simply adds the quantity of the scanned item to the internal pantry.

### 2. External Lookup (Open Food Facts)

If the item doesn't exist in your internal pantry or the quantity is different than one that exists, the system reaches out to the **Open Food Facts (OFF)** database to retreieve product information.

### 3. Local Parsing and Cleaning

The OFF data is community sourced, which means it can be very inaccurate and inconsistent. To fix this issue, the data retrieved is sent back to the Interface device so that the user can double-check and add missing information to the item before adding it to their internal pantry. Pantry.io then handles the rest of the logic internally by:
* **Normalizing Units**: To make everything easier for both the application and you, quantities are normalized to either grams or millilitres.
* **Normalizing Names**: The same process is done to the item names. A generic name is attached to each item so that items of different brands can be stored and tracked together.
