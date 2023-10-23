---
title: Useful Utility Classes
sidebar_position: 6
---
### Driver API
These byte utility classes are provided by the driver API and are very useful when writing protocol based drivers.

| Class | Description |
|-------|-------------|
| `ByteUtilities` | Useful functions for serializing most basic data types to byte arrays. |
| `BCDByteUtilities` | Similar to ByteUtilies, but for BCD encoding, with both Little and Big Endian support. |

### Designer API
These classes are provided by the Designer API:

| Class | Description |
|-------|-------------|
| `EDTUtil` | Provides convenience functions for working with the EDT, and a useful `coalescingInvokeLater()` function that can be used to group multiple calls into a single event. |
| `ErrorUtil` | Many functions for displaying errors, but also other dialogs such as info and warning messages, and prompts. |
| `IconUtil` | Used for retrieving icons provided with Ignition. |

