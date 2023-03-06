import * as Opener from './components/opener';
import * as AlertOpener from './components/alert-opener';
import * as AdvancedOpener from './components/advanced-opener';
import * as AdvancedAlertOpener from './components/advanced-alert-opener';

function App() {
  return (
    <div className="max-w-3xl mx-auto p-20">
      <h2>single Opener component</h2>
      <Opener.Root>
        <Opener.Trigger>Opener 👍</Opener.Trigger>
        <Opener.Content>Opener Content</Opener.Content>
      </Opener.Root>
      <div className="h-40" />
      <h2>single AlertOpener component</h2>
      <AlertOpener.Root>
        <AlertOpener.Trigger>AlertOpener 👍</AlertOpener.Trigger>
        <AlertOpener.Content>Alert Opener Content</AlertOpener.Content>
      </AlertOpener.Root>
      <div className="h-40" />
      <h2>Opener in AlertOpener component</h2>
      <AlertOpener.Root>
        <Opener.Root>
          <Opener.Trigger>Opener 👍</Opener.Trigger>
          <Opener.Content>
            Opener Content
            <AlertOpener.Trigger className="ml-2">AlertOpener 👎</AlertOpener.Trigger>
          </Opener.Content>
        </Opener.Root>
        <AlertOpener.Content>Alert Opener Content</AlertOpener.Content>
      </AlertOpener.Root>
      <div className="h-40" />
      <h2>Advanced Opener in AlertOpener component</h2>
      <AdvancedAlertOpener.Root>
        <AdvancedOpener.Root>
          <AdvancedOpener.Trigger>Advanced Opener 👍</AdvancedOpener.Trigger>
          <AdvancedOpener.Content>
            <AdvancedAlertOpener.Trigger className="ml-2">
              Advanced AlertOpener 👍
            </AdvancedAlertOpener.Trigger>
          </AdvancedOpener.Content>
        </AdvancedOpener.Root>
        <AdvancedAlertOpener.Content className="mt-24">
          Alert Opener Content
        </AdvancedAlertOpener.Content>
      </AdvancedAlertOpener.Root>
    </div>
  );
}

export default App;
