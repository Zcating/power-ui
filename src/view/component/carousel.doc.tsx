import { defineComponent } from 'vue';
import { Carousel } from 'power-ui';

export default defineComponent(() => {
  const style = (color: string) => ({
    height: '100%',
    background: color,
    overflow: 'hidden',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  });
  console.log(Carousel);
  return () => (
    <Carousel>
      <div style={style('#364d79')}>1</div>
      <div style={style('#36dd79')}>2</div>
      <div style={style('#664d79')}>3</div>
      <div style={style('#334d79')}>4</div>
      <div style={style('#364479')}>5</div>
      <div style={style('#36dd79')}>6</div>
    </Carousel>
  );
});
