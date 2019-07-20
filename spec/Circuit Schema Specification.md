Logic Circuit Schema
====================

Goals and requirements for this specification
---------------------------------------------

1) Provide a common format to exchange logic circuit
information between components in breadstone itself, but
also for import and export and to interoperate with other
applications.

2) The information in the circuit must represent
logical links between all components

3) Additional layouting information can optionally be
added to the schema for viewing the circuit in a circuit
viewer or editor

4) The schema should allow for a description of custom components

    4.1) These components must be built from in-built raw
    components, which will also be defined in the schema
    specification

5) Due to planned expansion of the inbuilt raw components,
this schema needs to version itself.

Format
------

Format of the logic circuit schema will be JSON. It interoperates well with the web, ComputerCraft, and is easy to parse in most languages, whereas XML can be more tricky.

Specification Version
---------------------

This specification is version 0.1.0

### Root Object

The root object contains the following JSON key-value pairs:

```json
{
    "version": "0.1.0",
    "circuit": {}
}
```

| key     | type    | description                          |
|---------|---------|--------------------------------------|
| version | string  | Version of this specification        |
| circuit | Circuit | The actual logic circuit information |


### Circuit Object

The circuit object contains the following key-value pairs:

```json
{
    "id": "",
    "subCircuits": [],
    "components": [],
    "wiring": [],
    "pins": []
}
```

| key         | type        | description                                                       |
|-------------|-------------|-------------------------------------------------------------------|
| id          | string      | Unique identifier of the circuit                                  |
| subCircuits | Circuit[]   | Here are definitions of custom components                         |
| components  | Component[] | Instances of circuits and inbuilt components of the specification |
| wiring      | Wiring[]    | Instances of wires that links components together                 |
| pins        | Pin[]       | Pins of the circuit for I/O                                       |

### Component Object

The Component object contains the following key-value pairs:

```json
{
    "id": "",
    "type": ""
}
```

### Wiring Object

```json
{
    "componentPins": [],
    "circuitPins": []
}
```

### ComponentPin

```json
{
    "componentId": "",
    "pinId": ""
}
```

### Connection

```json
{
    "type": "",
    "componentId": "",
    "pinId": ""
}
```

Example circuit
---------------

Example logic circuit file representing a circuit using a custom AND-component, and connecting 2 inputs and 1 output to it.

The AND-component is built from 3 $NOT-components.

```json
{
    "version": "0.1.0",
    "circuit": {
        "id": "root",
        "subCircuits": [
            {
                "id": "and",
                "subCircuits": [],
                "pins": [
                    { "id": "i0" },
                    { "id": "i1" },
                    { "id": "q0" }
                ],
                "components": [
                    { "id": "0", "type": "$NOT" },
                    { "id": "1", "type": "$NOT" },
                    { "id": "2", "type": "$NOT" },
                ],
                "wiring": [
                    {
                        "circuitPins": ["i0"],
                        "componentPins": [{ "componentId": "0", "pinId": "$i" }]
                    },
                    {
                        "circuitPins": ["i1"],
                        "componentPins": [{ "componentId": "1", "pinId": "$i" }]
                    },
                    {
                        "circuitPins": [],
                        "componentPins": [
                            { "componentId": "0", "pinId": "$q" },
                            { "componentId": "1", "pinId": "$q" },
                            { "componentId": "2", "pinId": "$i" }
                        ]
                    },
                    {
                        "circuitPins": ["q0"],
                        "componentPins": [{ "componentId": "2", "pinId": "$q" }]
                    }
                ]
            }
        ],
        "components": [
            { "id": "0", "type": "and" }
        ],
        "pins": [
            { "id": "i0" }
            { "id": "i1" }
            { "id": "q0" }
        ],
        "wiring": [
            {
                "circuitPins": ["i0"],
                "componentPins": [{ "componentId": "0", "pinId": "i0" }]
            },
            {
                "circuitPins": ["i1"],
                "componentPins": [{ "componentId": "0", "pinId": "i1" }]
            },
            {
                "circuitPins": ["q0"],
                "componentPins": [{ "componentId": "0", "pinId": "q0" }]
            }
        ]
    }
}
```
