<div align=center>

# classifier.js

![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)
![version](https://img.shields.io/badge/version-1.1.0-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

:robot: An library for natural language processing with JavaScript

<img src="https://user-images.githubusercontent.com/79997705/189793574-ee73d2eb-2574-43f0-b464-541049d3a40d.png" width="550px" heigth="550px">

</div>

## Table of Contents
- [Instalation](#Instalation)
- [Example of use](#Example-of-use)
  - [Auto detection of numeric strings shape](#Auto-detection-of-numeric-strings-shape)
- [API](#API)
  - [learn](#learn)
  - [classify](#classify)
  - [resetKnowledge](#resetKnowledge)
  - [toJSON](#toJSON)
  - [fromJSON](#fromJSON)
 
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

### Auto detection of numeric strings shape

~~~typescript
import { Classifier } from 'classifier.js'

const classifier = new Classifier({ percentualReturn: true })

classifier.learn('000.000.000-11', ['cpf'])
classifier.learn('00.000.000/0001-00', ['cnpj'])
classifier.learn('00155-333', ['zipcode'])

classifier.classify('999.999.999-99')
// OUTPUT: { unknown: '0%', cpf: '100%', cnpj: '0%', zipcode: '0%' }
classifier.classify('99.999.999/9999-99')
// OUTPUT: { unknown: '0%', cpf: '0%', cnpj: '100%', zipcode: '0%' }
classifier.classify('99999-999')
// OUTPUT: { unknown: '0%', cpf: '0%', cnpj: '0%', zipcode: '100%' }
~~~

## API

### `learn`

Receive data with an array of related categories.
~~~typescript
classifier.learn('Your sentence', ['your-category'])
~~~

### `classify`

Classify a sentence based on received data. 
~~~typescript
classifier.classify('Sentence to classify')
~~~

### `resetKnowledge`

Removes all that was learned.
~~~typescript
classifier.resetKnowledge()
~~~

### `toJSON`

Saves classifier data to a JSON file that can be imported later.
~~~typescript
classifier.toJSON('myFolder/savedClassifier.json')
# Or simply
classifier.toJSON('savedClassifier.json')
~~~

### `fromJSON`

Imports data from a JSON file.
~~~typescript
classifier.fromJSON('myFolder/savedClassifier.json')
# Or simply
classifier.fromJSON('savedClassifier.json')
~~~


