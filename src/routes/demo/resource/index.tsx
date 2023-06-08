import { component$, useSignal } from '@builder.io/qwik';
// import {
//   type DocumentHead,
//   routeLoader$,
//   routeAction$,
//   zod$,
//   z,
//   Form,
// } from '@builder.io/qwik-city';
import { ResourceTest } from '../../../components/resource-test/resource-test'


export default component$(() => {
    const sig = useSignal("test")
  return (
    <>
      <ResourceTest sig={sig} />
    </>
  );
});

