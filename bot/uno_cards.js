const cards = [
    {
        type: 'draw',
        content: 'four',
        light: 'CAADAgADiQMAAk9wUEg1fzyY8FgCZgI',
        dark: 'CAADAgADtAMAAk9wUEiEDCzN-ZufxAI',
        quantity: 4
    },
    {
        type: 'choose',
        content: 'color',
        light: 'CAADAgADmwMAAk9wUEgGjFv_XetVPAI',
        dark: 'CAADAgADyQMAAk9wUEj7TDyDL4ZMhgI',
        quantity: 4
    },
    {
        type: 'y',
        content: 'reverse',
        light: 'CAADAgAD3AIAAseySUhy5e5w5AYaqwI',
        dark: 'CAADAgADnwMAAk9wUEg3oD-QCtyv_gI',
        quantity: 2
    },
    {
        type: 'r',
        content: 'reverse',
        light: 'CAADAgAD5wIAAseySUjSFQmCV0Q5VQI',
        dark: 'CAADAgADsAMAAk9wUEgbnhIc2DCM_AI',
        quantity: 2
    },
    {
        type: 'b',
        content: 'reverse',
        light: 'CAADAgADmgMAAk9wUEixAkTWMiRZQgI',
        dark: 'CAADAgADyAMAAk9wUEgDZTylBEJZ2wI',
        quantity: 2
    },
    {
        type: 'g',
        content: 'reverse',
        light: 'CAADAgADngMAAk9wUEg2sF3mAr6D4AI',
        dark: 'CAADAgADzQMAAk9wUEjWTC1ZGH4WqAI',
        quantity: 2
    },
    {
        type: 'y',
        content: 'draw',
        light: 'CAADAgADigMAAk9wUEhhq91otjZ-qwI',
        dark: 'CAADAgAD8wIAAseySUgmv5CDF4flhgI',
        quantity: 2
    },
    {
        type: 'r',
        content: 'draw',
        light: 'CAADAgADkQMAAk9wUEjbNUD6Fn1GIQI',
        dark: 'CAADAgADvgMAAk9wUEgmR-3ymzxtxAI',
        quantity: 2
    },
    {
        type: 'b',
        content: 'draw',
        light: 'CAADAgAD5QIAAseySUhcruhIu1G-ngI',
        dark: 'CAADAgADrwMAAk9wUEh_7u4zSVkaSQI',
        quantity: 2
    },
    {
        type: 'g',
        content: 'draw',
        light: 'CAADAgADfgMAAk9wUEgsghsS-Zc_iwI',
        dark: 'CAADAgADpwMAAk9wUEjrXEV7gihhCgI',
        quantity: 2
    },
    {
        type: 'y',
        content: 'skip',
        light: 'CAADAgAD4gIAAseySUi2odgfcaIRFwI',
        dark: 'CAADAgADqAMAAk9wUEhWIwWt1YTOQgI',
        quantity: 2
    },
    {
        type: 'r',
        content: 'skip',
        light: 'CAADAgAD3wIAAseySUitxTgGuFZo4gI',
        dark: 'CAADAgADpAMAAk9wUEjVZAKzIajF3wI',
        quantity: 2
    },
    {
        type: 'b',
        content: 'skip',
        light: 'CAADAgADjQMAAk9wUEhioLRerJ23FwI',
        dark: 'CAADAgADugMAAk9wUEgB60poi4fRfwI',
        quantity: 2
    },
    {
        type: 'g',
        content: 'skip',
        light: 'CAADAgADiwMAAk9wUEjbnFgLYpuG7wI',
        dark: 'CAADAgADtwMAAk9wUEjHvt7slZazUwI',
        quantity: 2
    },
    {
      type: 'y',
      content: '0',
      light: 'CAADAgAD4QIAAseySUgg7DTlbUZ7JgI',
      dark: 'CAADAgADpgMAAk9wUEgLNo1CAj1-qAI', 
      quantity: 1
    },
    {
      type: 'r',
      content: '0',
      light: 'CAADAgADhgMAAk9wUEjescGFZdFv7QI',
      dark: 'CAADAgADsQMAAk9wUEgWY_IdvljiYwI', 
      quantity: 1
    },
    {
      type: 'b',
      content: '0',
      light: 'CAADAgAD5gIAAseySUhpOyN2IdIeBAI',
      dark: 'CAADAgAD8gIAAseySUiS8q6SPfkSdwI', 
      quantity: 1
    },
    {
      type: 'g',
      content: '0',
      light: 'CAADAgAD6wIAAseySUjZ0JmK93kJTQI',
      dark: 'CAADAgADwQMAAk9wUEgAATFHPdMw5QMC',
      quantity: 1
    },
    {
      type: 'y',
      content: '1',
      light: 'CAADAgADnQMAAk9wUEin6Vo81VdUSAI',
      dark: 'CAADAgADywMAAk9wUEiqZCKbaLaHjAI', 
      quantity: 2
    },
    {
      type: 'r',
      content: '1',
      light: 'CAADAgADkgMAAk9wUEhk4v36yl_VWQI',
      dark: 'CAADAgAD9AIAAseySUhsJoBNviG6fQI',
      quantity: 2
    },
    {
      type: 'b',
      content: '1',
      light: 'CAADAgAD7QIAAseySUiFeYcg24aSxgI',
      dark: 'CAADAgADzAMAAk9wUEin3-xSuHYRHwI',
      quantity: 2
    },
    {
      type: 'g',
      content: '1',
      light: 'CAADAgADewMAAk9wUEi4DJO-L2tZNAI',
      dark: 'CAADAgADoAMAAk9wUEj5guEu1Lbk_QI',
      quantity: 2
    },
    {
      type: 'y',
      content: '2',
      light: 'CAADAgADiAMAAk9wUEjPFzRjZNbL-wI',
      dark: 'CAADAgADswMAAk9wUEjYTDVsrHcKNAI',
      quantity: 2
    },
    {
      type: 'r',
      content: '2',
      light: 'CAADAgADggMAAk9wUEgoaiUIRbe3IQI',
      dark: 'CAADAgAD8AIAAseySUjJti9Flw6D8QI',
      quantity: 2
    },
    {
      type: 'b',
      content: '2',
      light: 'CAADAgADhwMAAk9wUEjUxdZoY4EaKAI',
      dark: 'CAADAgADsgMAAk9wUEhX_1ki4Kc3ggI',
      quantity: 2
    },
    {
      type: 'g',
      content: '2',
      light: 'CAADAgADhAMAAk9wUEiSka25-wAB4mYC',
      dark: 'CAADAgAD8QIAAseySUg2tYP02DsTmAI',
      quantity: 2
    },
    {
      type: 'y',
      content: '3',
      light: 'CAADAgAD5AIAAseySUgFrbgN67cbXwI',
      dark: 'CAADAgADrgMAAk9wUEgXZ_aapTQPiAI',
      quantity: 2
    },
    {
      type: 'r',
      content: '3',
      light: 'CAADAgAD6AIAAseySUit_A1wxY7fQgI',
      dark: 'CAADAgADtQMAAk9wUEjDhKZTwO06cAI',
      quantity: 2
    },
    {
      type: 'b',
      content: '3',
      light: 'CAADAgADjgMAAk9wUEhUtoQgz4tIIQI',
      dark: 'CAADAgADuwMAAk9wUEhlQ10DpjmDDAI',
      quantity: 2
    },
    {
      type: 'g',
      content: '3',
      light: 'CAADAgADkAMAAk9wUEhGiA1COUKTWQI',
      dark: 'CAADAgADvQMAAk9wUEjmRGnHhfEQkQI',
      quantity: 2
    },
    {
      type: 'y',
      content: '4',
      light: 'CAADAgADgwMAAk9wUEiZluO_3K4VDQI',
      dark: 'CAADAgADqwMAAk9wUEi8e4aX6OIF5wI',
      quantity: 2
    },
    {
      type: 'r',
      content: '4',
      light: 'CAADAgADnAMAAk9wUEiPhQKi3V5BVAI',
      dark: 'CAADAgADygMAAk9wUEhF_V8hXwMuagI',
      quantity: 2
    },
    {
      type: 'b',
      content: '4',
      light: 'CAADAgAD4AIAAseySUhAe-WUua50hQI',
      dark: 'CAADAgADpQMAAk9wUEgma85xe3g_DwI',
      quantity: 2
    },
    {
      type: 'g',
      content: '4',
      light: 'CAADAgADlgMAAk9wUEjLPr0btKoBdAI',
      dark: 'CAADAgADwwMAAk9wUEiq7Z8QOwty_AI',
      quantity: 2
    },
    {
      type: 'y',
      content: '5',
      light: 'CAADAgAD3QIAAseySUjQ4T4byCeH-QI',
      dark: 'CAADAgAD7gIAAseySUj6a9-7sg5LHwI',
      quantity: 2
    },
    {
      type: 'r',
      content: '5',
      light: 'CAADAgAD3gIAAseySUjdkhZ6ikBotAI',
      dark: 'CAADAgADowMAAk9wUEivJSp08kP4XQI',
      quantity: 2
    },
    {
      type: 'b',
      content: '5',
      light: 'CAADAgADlAMAAk9wUEikiYYpAYCrmQI',
      dark: 'CAADAgADwAMAAk9wUEh_ttsP70SyUAI',
      quantity: 2
    },
    {
      type: 'g',
      content: '5',
      light: 'CAADAgAD7AIAAseySUiZ94yjPRKKPwI',
      dark: 'CAADAgADxQMAAk9wUEiOMCwiPYDioQI',
      quantity: 2
    },
    {
      type: 'y',
      content: '6',
      light: 'CAADAgAD4wIAAseySUihNLTWE-v_dQI',
      dark: 'CAADAgADrAMAAk9wUEh6sR2aCrBAeAI',
      quantity: 2
    },
    {
      type: 'r',
      content: '6',
      light: 'CAADAgADgQMAAk9wUEhR8swdwflaQwI',
      dark: 'CAADAgAD7wIAAseySUjDrhiSw8IxfgI',
      quantity: 2
    },
    {
      type: 'b',
      content: '6',
      light: 'CAADAgADfQMAAk9wUEhxgz0hGpmoJgI',
      dark: 'CAADAgADogMAAk9wUEhmKkXJg_Fv9gI',
      quantity: 2
    },
    {
      type: 'g',
      content: '6',
      light: 'CAADAgADlwMAAk9wUEhBZ0E4WkpZIwI',
      dark: 'CAADAgADxAMAAk9wUEjBbpPfZpIE3gI',
      quantity: 2
    },
    {
      type: 'y',
      content: '7',
      light: 'CAADAgAD6gIAAseySUhrT7VCx9Up0wI',
      dark: 'CAADAgADuQMAAk9wUEhZe8nHdNVftwI',
      quantity: 2
    },
    {
      type: 'r',
      content: '7',
      light: 'CAADAgADmAMAAk9wUEiFp5poipC8hgI',
      dark: 'CAADAgADxgMAAk9wUEiYlQeP8jOplQI',
      quantity: 2
    },
    {
      type: 'b',
      content: '7',
      light: 'CAADAgADmQMAAk9wUEhMIYl9DLwSNgI',
      dark: 'CAADAgADxwMAAk9wUEgS0TUi3RRojwI',
      quantity: 2
    },
    {
      type: 'g',
      content: '7',
      light: 'CAADAgADhQMAAk9wUEhJaq5oUqeDgQI',
      dark: 'CAADAgADrQMAAk9wUEg53kujX5rP2AI',
      quantity: 2
    },
    {
      type: 'y',
      content: '8',
      light: 'CAADAgADfAMAAk9wUEjJ15Lr-10XRgI',
      dark: 'CAADAgADoQMAAk9wUEg7E0IMmfHOBAI',
      quantity: 2
    },
    {
      type: 'r',
      content: '8',
      light: 'CAADAgADkwMAAk9wUEjodD4zjAh7FgI',
      dark: 'CAADAgADvwMAAk9wUEhvZPDJwpvLFAI',
      quantity: 2
    },
    {
      type: 'b',
      content: '8',
      light: 'CAADAgADfwMAAk9wUEhqalELuqlqGwI',
      dark: 'CAADAgADqQMAAk9wUEgG5jqe1VGoQAI',
      quantity: 2
    },
    {
      type: 'g',
      content: '8',
      light: 'CAADAgAD6QIAAseySUi_JI3nWGyrOwI',
      dark: 'CAADAgADtgMAAk9wUEij5aWiQSRvsQI',
      quantity: 2
    },
    {
      type: 'y',
      content: '9',
      light: 'CAADAgADgAMAAk9wUEjJLhdHH4gfTwI',
      dark: 'CAADAgADqgMAAk9wUEhSETm0HGOu1QI',
      quantity: 2
    },
    {
      type: 'r',
      content: '9',
      light: 'CAADAgADjwMAAk9wUEiFG0ayDANWvwI',
      dark: 'CAADAgADvAMAAk9wUEhb4cnEL_GGfQI',
      quantity: 2
    },
    {
      type: 'b',
      content: '9',
      light: 'CAADAgADjAMAAk9wUEgrDuMzknc7gQI',
      dark: 'CAADAgADuAMAAk9wUEgAAZBQy2Lzr1UC',
      quantity: 2
    },
    {
      type: 'g',
      content: '9',
      light: 'CAADAgADlQMAAk9wUEg8X2LEMEOjJQI',
      dark: 'CAADAgADwgMAAk9wUEhz68cfrzdOnAI',
      quantity: 2
    }
  ]

module.exports = cards;