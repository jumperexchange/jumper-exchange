# Decisions

A log of small, scoped engineering decisions for `jumper-exchange`. One file per decision under `decisions/`.

| Decision                                        | Summary                                                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Dust rendering](./decisions/dust-rendering.md) | Collapse sub-`0.0001` token-amount strings to `<0.0001 SYMBOL` via a single shared helper in `src/utils/formatNumbers.ts`. |
