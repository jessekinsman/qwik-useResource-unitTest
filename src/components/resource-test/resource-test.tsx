/* eslint-disable no-console */
import { component$, useStore, Resource, useResource$, type Signal } from '@builder.io/qwik';

export const ResourceTest =  component$(() => {
  const github = useStore({
    org: 'BuilderIO',
  });

  const reposResource = useResource$<string[]>(({ track, cleanup }) => {
    // We need a way to re-run fetching data whenever the `github.org` changes.
    // Use `track` to trigger re-running of this data fetching function.
    track(() => github.org);

    // A good practice is to use `AbortController` to abort the fetching of data if
    // new request comes in. We create a new `AbortController` and register a `cleanup`
    // function which is called when this function re-runs.
    const controller = new AbortController();
    cleanup(() => controller.abort());

    // Fetch the data and return the promises.
    return getRepositories(github.org, controller);
  });

  console.log('Render');
  return (
    <main>
      <p>
        <label>
          GitHub username:
          <input
            id="resourceInput"
            value={github.org}
            onInput$={(ev) => (github.org = (ev.target as HTMLInputElement).value)}
          />
        </label>
        <button id="loadWidget" onClick$={() => github.org = "onwidget"}>Load onWidget</button>
      </p>
      <section>
        <Resource
          value={reposResource}
          onPending={() => <><div id="loading">Loading...</div></>}
          onRejected={(error) => <>Error: {error.message}</>}
          onResolved={(repos) => (
            <ul>
              {repos.map((repo) => (
                <li>
                    <GithubLink store={github} link={repo} />                  
                </li>
              ))}
            </ul>
          )}
        />
      </section>
    </main>
  );
});

export async function getRepositories(
  username: string,
  controller?: AbortController
): Promise<string[]> {
  console.log('FETCH', `https://api.github.com/users/${username}/repos`);
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    signal: controller?.signal,
  });
  console.log('FETCH resolved');
  const json = await resp.json();
  return Array.isArray(json)
    ? json.map((repo: { name: string }) => repo.name)
    : Promise.reject(json);
}

export const GithubLink = component$<{
    link: string
    store: any
}>(({ link, store }) => {
    return (
        <a href={`https://github.com/${store.org}/${link}`}>{link}</a>
    )
})