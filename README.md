# classifier.js

![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)
![version](https://img.shields.io/badge/version-1.0.4-blue)

:robot: Natural language processing with Javascript

## Table of Contents
- [Instalation](#Instalation)
- [Example of use](#Example-of-use)
- [API](#API)

## Instalation

~~~shell
npm i classifier.js
# or
yarn add classifier.js
~~~

## Example of use

~~~typescript
import { Classifier } from 'classifier.js'

const classifier = new Classifier({ percentualReturn: true })

classifier.learn('I like cats', ['animal'])
classifier.learn('Cats are cool', ['animal'])
classifier.learn('Dogs are noisy', ['animal'])
classifier.learn('I love animals', ['animal'])
classifier.learn('I like my horse', ['animal'])
classifier.learn('Chocolate is good', ['food'])
classifier.learn('I eat apple', ['food'])
classifier.learn('Juice is very good', ['food'])
classifier.learn('Brazilians eat rice and beans', ['food'])
classifier.learn('Bananas are good for health', ['food'])

classifier.classify('Apple juice is awesome')
// OUTPUT: { unknown: '20%', animal: '0%', food: '80%' }
~~~

## API

### `learn`

Receive data with an array of related categories.

### `classify`

Classify a sentence based on received data. 

### `resetAcknowledgement`

Removes all that was learned.
