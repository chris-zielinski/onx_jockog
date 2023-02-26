## Online experiment: "Jeux Olympiques du Clavier" / Keyboard Olympic games _(onx\_jockog)_

### <img src="img/logo_kogjc.png" width="150" style="margin:15px;">

The game consists to press the key of the keyboard corresponding to the character which is appearing on the screen. The reaction time is collected. 

The study concerns the learning of regularities: certain sequences of 3 letters (regularities) are reproduced several times during the series played, the study aims at evaluating the evolution of the reaction times according to the order of occurence of these regularities.
 
The experiment was built using the [jsPsych library](https://www.jspsych.org), and a customized plugins have been created (./lib/jspsych/plugins/):
* _jspsych-char-typing.js:_ display of one letter by one letter and the participant response (validity and reaction time)
  <img src="img/task_example.png" width="150" style="display:block;margin:10px auto;">
* _jspsych-countdown.js:_ display of a countdown with animated numbers at each second ("3..2..1.. go!")
* _jspsych-form-kb-layout.js:_ special form layout to ask the participant for the kind of keyboard that is used (azerty, querty, other)
  <img src="img/plugin_kb_layout.png" width="250" style="display:block;margin:10px auto;">
* _jspsych-form.js:_ display of a complexe form with different type of responses (radio button, checkbox, list, input field)


### Research team:
Arnaud Rey<sup>1</sup>, Benoît Favre<sup>2</sup>, Christelle Zielinski<sup>3</sup> (<sup>1</sup>[Laboratoire de Psychologie Cognitive](https://lpc.univ-amu.fr/) ; <sup>2</sup>[Laboratoire d'Informatique & Systèmes](https://www.lis-lab.fr/) ; <sup>3</sup>[Institute of Language, Communication and the Brain](https://www.ilcb.fr/))
