import { CSSProperties, defineComponent } from 'vue';
import { Carousel } from 'power-ui';

export default defineComponent(() => {
  const style: CSSProperties = {
    textAlign: 'center',
    height: '160px',
    lineHeight: '160px',
    background: '#364d79',
    overflow: 'hidden',
  };
  console.log(Carousel);
  return () => (
    <Carousel>
      <div style={style}>1</div>
      <div style={style}>2</div>
      <div style={style}>3</div>
      <div style={style}>4</div>
      <div style={style}>5</div>
      <div style={style}>6</div>
    </Carousel>
  );
});
