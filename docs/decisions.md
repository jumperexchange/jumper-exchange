# Decisions

A log of small, scoped engineering decisions for `jumper-exchange`. One file per decision under `decisions/`.

| Decision                                        | Summary                                                                                                                                                    |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Dust rendering](./decisions/dust-rendering.md) | Collapse sub-`0.0001` token-amount strings to `<0.0001 SYMBOL` and sub-`$0.01` USD strings to `<$0.01` via shared helpers in `src/utils/formatNumbers.ts`. |
