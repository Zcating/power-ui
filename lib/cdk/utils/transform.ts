

export function toAttrComponent<T extends object>() {
  return <C extends (new (...args: any) => any)>(component: C) => (component as any as {
    new(): InstanceType<C> & { 
      $props: T & Partial<Pick<InstanceType<C>, '$props'>>,
    }
  });
}

// export function toAttrComponent<C extends (new (...args: any) => any)>(component: C) {
//   return <T extends object>() => (component as any as {
//     new(): InstanceType<C> & { 
//       $props: Partial<Pick<InstanceType<C>, '$props'>> & T,
//     }
//   });
// }

// export function toAttrComponent<T extends object, C extends (new (...args: any) => any)>(component: C) {
//   return component as any as {
//     new(): { $props: Partial<Pick<InstanceType<C>, '$props'>> & T }
//   }
// }
