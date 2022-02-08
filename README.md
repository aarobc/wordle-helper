### Setup

This uses a submodule to provide the word list

To setup:

    git clone --recurse-submodules git@github.com:aarobc/wordle-helper.git

to run:

    make cheat

### Todo:
my strategy doesn't really handle double occurances of letters yet,
need to find a way to indicate that with the text-based ui.


example:

```
>make cheat
attempted word: fling
aproximate matches:
exact maching letters: in
potential matches: [
  'djins', 'joins', 'joint', 'kvint',
  'msink', 'pyins', 'poind', 'point',
  'quink', 'quins', 'quint', 'shiny',
  'skint', 'spiny', 'spink', 'stink',
  'suint', 'swink', 'think', 'thins',
  'twiny', 'twink', 'twins', 'whiny',
  'whins', 'djinn', 'imino', 'noint',
  'shins', 'skink', 'skins', 'spins',
  'stint', 'twint', 'uninn'
]
```
