export interface ConceptItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  summary: string;
  detailedExplanation: string;
  realWorldExample: string;
  mnemonicTrick: string;
  color: string;
}

export const QUADRANT_EXPLANATIONS = {
  TP: {
    code: 'VP',
    english: 'True Positive (TP)',
    name: 'Verdadero Positivo',
    badge: 'Acierto Positivo',
    color: 'emerald',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    tagline: '¡Diana! Dijiste que sí había algo, y efectivamente lo había.',
    description: 'La Inteligencia Artificial predijo que el caso era POSITIVO (detectó la condición), y en la REALIDAD era verdad.',
    example: 'El detector de humo sonó y de verdad se estaba quemando la tostada en la cocina.',
    rule: '1ª palabra "Verdadero" = Acertó. 2ª palabra "Positivo" = Dijo que SÍ.',
  },
  TN: {
    code: 'VN',
    english: 'True Negative (TN)',
    name: 'Verdadero Negativo',
    badge: 'Acierto Negativo',
    color: 'blue',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-300',
    tagline: '¡Tranquilidad! Dijiste que no había nada, y todo estaba en orden.',
    description: 'La Inteligencia Artificial predijo que el caso era NEGATIVO (sin peligro o sin condición), y en la REALIDAD era verdad.',
    example: 'El filtro del correo revisó la carta de tu profesor y la dejó en tu bandeja de entrada porque NO era spam.',
    rule: '1ª palabra "Verdadero" = Acertó. 2ª palabra "Negativo" = Dijo que NO.',
  },
  FP: {
    code: 'FP',
    english: 'False Positive (FP) / Error Tipo I',
    name: 'Falso Positivo (Falsa Alarma)',
    badge: 'Error Tipo I',
    color: 'amber',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-300',
    tagline: '¡Falsa Alarma! Gritaste "¡Fuego!", pero solo era vapor de la ducha.',
    description: 'La Inteligencia Artificial predijo POSITIVO, pero en la REALIDAD era NEGATIVO. La IA se asustó sin motivo.',
    example: 'El antivirus del colegio bloqueó la tarea de matemáticas diciendo que era un "virus troyano".',
    rule: '1ª palabra "Falso" = Se equivocó. 2ª palabra "Positivo" = Dijo que SÍ (cuando no era).',
  },
  FN: {
    code: 'FN',
    english: 'False Negative (FN) / Error Tipo II',
    name: 'Falso Negativo (Peligro Oculto)',
    badge: 'Error Tipo II',
    color: 'rose',
    borderColor: 'border-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-300',
    tagline: '¡Peligro Oculto! Dijiste "Aquí no pasa nada", pero sí había peligro.',
    description: 'La Inteligencia Artificial predijo NEGATIVO, pero en la REALIDAD el caso era POSITIVO. El peligro o la condición se le escapó a la IA.',
    example: 'El detector de humo se quedó mudo mientras el sartén ardía en llamas.',
    rule: '1ª palabra "Falso" = Se equivocó. 2ª palabra "Negativo" = Dijo que NO (cuando sí era).',
  },
};

export const PEDRO_AND_WOLF_STORY = {
  title: 'El Cuento de Pedro y el Lobo: La Mejor Mnemotécnica',
  intro: '¿Sabías que la fábula de hace siglos explica a la perfección los dos errores de la ciencia de datos?',
  act1: {
    title: 'Acto 1: La Falsa Alarma (Falso Positivo / Error Tipo I)',
    text: 'Pedro sale gritando: "¡Viene el lobo, viene el lobo!". Los campesinos corren asustados a proteger sus ovejas, pero el lobo NO existía; era una broma. Pedro predijo POSITIVO (hay lobo), pero la realidad era NEGATIVA (no hay lobo).',
    moral: '¡Falso Positivo! Gastaste energía y te alarmaste por nada.',
  },
  act2: {
    title: 'Acto 2: El Peligro Oculto (Falso Negativo / Error Tipo II)',
    text: 'Días después, el lobo REALMENTE ataca a las ovejas. Los campesinos dicen: "Bah, no hay peligro, no vamos a ir". Predijeron NEGATIVO (no hay peligro), pero la realidad era POSITIVA (el lobo estaba ahí y se comió las ovejas).',
    moral: '¡Falso Negativo! El peor desenlace: ignorar una amenaza real.',
  },
};

export const METRIC_EXPLANATIONS = [
  {
    name: 'Exactitud (Accuracy)',
    formula: '(VP + VN) / Total',
    simpleFormula: 'Aciertos Totales / Todos los casos',
    definition: 'Porcentaje general de decisiones correctas que tomó el modelo.',
    analogy: 'Es como tu nota en el examen: preguntas acertadas entre el total de preguntas.',
    danger: '¡Cuidado con la trampa! Si tienes 99 alumnos sanos y 1 enfermo, una IA vaga que diga "todos están sanos" tiene 99% de exactitud, pero ¡no detecta al enfermo!',
  },
  {
    name: 'Precisión (Precision)',
    formula: 'VP / (VP + FP)',
    simpleFormula: 'Aciertos Positivos / Todas las veces que gritó "¡Alerta!"',
    definition: 'De todas las veces que la IA predijo positivo, ¿cuántas eran verdaderas?',
    analogy: 'Si un detector de spam manda 10 correos a la papelera, ¿cuántos de esos 10 eran basura real y cuántos correos importantes de tu abuela?',
    danger: 'Crucial cuando equivocarse diciendo "SÍ" cuesta muy caro (ejemplo: meter a una persona inocente a prisión).',
  },
  {
    name: 'Sensibilidad / Recall (Exhaustividad)',
    formula: 'VP / (VP + FN)',
    simpleFormula: 'Aciertos Positivos / Todos los casos Positivos que existían',
    definition: 'De todas las personas enfermas (o amenazas reales) que había en el mundo, ¿a cuántas logró atrapar la IA?',
    analogy: 'Si en el aeropuerto había 10 maletas con contrabando, ¿cuántas detectó el escáner?',
    danger: 'Crucial cuando dejar escapar un caso positivo es fatal (ejemplo: detectar cáncer o meteoritos).',
  },
  {
    name: 'F1-Score',
    formula: '2 × (Precisión × Recall) / (Precisión + Recall)',
    simpleFormula: 'Promedio armónico entre Precisión y Recall',
    definition: 'Métrica de balance perfecto. Si la Precisión es pésima o el Recall es pésimo, el F1-Score se desploma.',
    analogy: 'Como en el fútbol: no sirve de nada tener solo buena defensa o solo buen ataque; el F1 mide el equilibrio total del equipo.',
    danger: 'Es la métrica más recomendada cuando los datos están desbalanceados.',
  },
  {
    name: 'Especificidad (Specificity)',
    formula: 'VN / (VN + FP)',
    simpleFormula: 'Aciertos Negativos / Todos los casos Negativos reales',
    definition: 'De todos los casos sanos/normales, ¿a qué porcentaje identificó correctamente como sanos?',
    analogy: '¿Qué tan bueno es el filtro para dejar en paz a la gente que no tiene nada?',
    danger: 'Complementa al Recall para evaluar la clase negativa.',
  },
];
