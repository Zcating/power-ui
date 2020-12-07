import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../view/home';
import {
  ComponentDoc,
  CheckboxDoc,
  ButtonDoc,
  RadioDoc,
  SwitchDoc,
  Pending,
  AlertDoc,
  DialogDoc,
  TransferDoc,
  FormDoc,
  TreeDoc,
  CalendarDoc,
  CarouselDoc
} from '../view/component';
export default createRouter({
  history: createWebHashHistory(''),
  routes: [
    {
      path: '/',
      component: Home,
    }, {
      path: '/component',
      name: 'component',
      component: ComponentDoc,
      children: [
        {
          path: 'button',
          name: 'button',
          component: ButtonDoc
        }, {
          path: 'checkbox',
          name: 'checkbox',
          component: CheckboxDoc
        }, {
          path: 'radio',
          name: 'radio',
          component: RadioDoc
        }, {
          path: 'switch',
          name: 'switch',
          component: SwitchDoc
        }, {
          path: 'alert',
          name: 'alert',
          component: AlertDoc
        }, {
          path: 'dialog',
          name: 'dialog',
          component: DialogDoc
        }, {
          path: 'transfer',
          name: 'transfter',
          component: TransferDoc,
        }, {
          path: 'form',
          name: 'form',
          component: FormDoc,
        }, {
          path: 'calendar',
          name: 'calendar',
          component: CalendarDoc,
        }, {
          path: 'tree',
          name: 'tree',
          component: TreeDoc,
        }, {
          path: 'carousel',
          name: 'carousel',
          component: CarouselDoc
        }, {
          path: ':name(.*)*',
          component: Pending
        }
      ]
    }
  ],
});
