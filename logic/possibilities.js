const possibilities = {

    'four': (card, change)=>
    {
        return [].concat(change ? [{'type' : card.color}, {'content': 'four'}, {'content': 'color'}] : []);
    },
    'reverse': (card, change)=>
    {
       return [{'content': 'reverse'}, {'type': card.type}].concat(change ? [{'content': 'four'}, {'content': 'color'}] : []);
    },
    'draw': (card, change)=>
    {
       return [{'content': card.content}].concat(change ? [{'type': card.type}, {'content': 'four'}, {'content': 'color'}] : []);
    },
    'skip': (card, change)=>
    {
       return [{'content': card.content}, {'type': card.type}].concat(change ? [{'content': 'four'}, {'content': 'color'}] : []);
    },
    'color': (card, change)=>
    {
        return [{'type': card.color}].concat(change ? [{'content': 'four'}, {'content': 'color'}] : []);
    },
    'simple': (card)=>
    {
       
        return [{'content':  card.content}, {'type': card.type}, {'content': 'four'}, {'content': 'color'}];
    },
    'any': (card)=>
    {
        return [{type: card.color || card.type}];
    }

}
module.exports = possibilities;