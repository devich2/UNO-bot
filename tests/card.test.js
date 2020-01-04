describe('Card', ()=>
{
    describe('#constructor', function() {
        it('should create a valid card', () => {
          expect(() => new Card(Values.ZERO, Colors.RED)).not.toThrow();
        });
    
        it('should create wild cards with no color', () => {
          expect(() => new Card(Values.WILD)).not.toThrow();
        });
    
        it('should create wild cards with a color', () => {
          expect(() => new Card(Values.WILD, Colors.RED)).not.toThrow();
        });
    
        it('should error if value is outside the enum', () => pending());
        it('should error if color is outside the enum', () => pending());
      });
})