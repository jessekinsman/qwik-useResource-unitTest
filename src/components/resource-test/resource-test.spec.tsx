import { useSignal, component$ } from '@builder.io/qwik'
import { createDOM } from '@builder.io/qwik/testing'
import { test, expect, vi } from 'vitest'
import { ResourceTest } from './resource-test'

test(`[ResourceTest Component]: Should render github repos`, async () => {
    const { screen, render, userEvent } = await createDOM()

    const TestComp = component$(() => {
        const sig = useSignal('test');
        return (
            <ResourceTest sig={sig} />
        )
    })

    await render(<TestComp />)
    
    //@ts-ignore
    await screen.qwik.state.$renderPromise$ 
    expect(screen.innerHTML).toContain("Loading") 

    await userEvent('#loadWidget',"click")

    
    const val = screen.querySelector("#resourceInput")?.value; 
    expect(val).toBe("jessekinsman")
    expect(screen.innerHTML).toContain("Loading") 
})