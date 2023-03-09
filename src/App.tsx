import * as Opener from './components/opener';
import * as AlertOpener from './components/alert-opener';
import * as AdvancedOpener from './components/advanced-opener';
import * as AdvancedAlertOpener from './components/advanced-alert-opener';
import * as RadixOpener from './components/radix-opener';
import * as RadixAlertOpener from './components/radix-alert-opener';

interface BoxProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}
function Box({ children, subTitle, title }: BoxProps) {
  return (
    <div>
      <h2 className="text-xl">{title}</h2>
      <h3 className="text-lg text-gray-700">{subTitle}</h3>
      {children}
    </div>
  );
}

function App() {
  return (
    <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 gap-20 sm:grid-cols-2">
      <Box title="single Opener component" subTitle="using normal React.createContext">
        <Opener.Root>
          <Opener.Trigger>Opener 👍</Opener.Trigger>
          <Opener.Content>Opener Content</Opener.Content>
        </Opener.Root>
      </Box>

      <Box title="single AlertOpener component" subTitle="using normal React.createContext">
        <AlertOpener.Root>
          <AlertOpener.Trigger>AlertOpener 👍</AlertOpener.Trigger>
          <AlertOpener.Content>Alert Opener Content</AlertOpener.Content>
        </AlertOpener.Root>
      </Box>

      <Box
        title="Opener in AlertOpener component (not work properly)"
        subTitle="using normal React.createContext"
      >
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
      </Box>

      <Box
        title="Opener in AlertOpener component (work preperly!)"
        subTitle="using advanced context"
      >
        <AdvancedAlertOpener.Root>
          <AdvancedOpener.Root>
            <AdvancedOpener.Trigger>Advanced Opener 👍</AdvancedOpener.Trigger>
            <AdvancedOpener.Content>
              Advanced Opener Content
              <AdvancedAlertOpener.Trigger className="ml-2">
                Advanced AlertOpener 👍
              </AdvancedAlertOpener.Trigger>
            </AdvancedOpener.Content>
          </AdvancedOpener.Root>
          <AdvancedAlertOpener.Content className="mt-24">
            Advanced Alert Opener Content
          </AdvancedAlertOpener.Content>
        </AdvancedAlertOpener.Root>
      </Box>

      <Box
        title="Opener in AlertOpener component (work preperly!)"
        subTitle="using radix createContextScope"
      >
        <RadixAlertOpener.Root>
          <RadixOpener.Root>
            <RadixOpener.Trigger>Radix Opener 👍</RadixOpener.Trigger>
            <RadixOpener.Content>
              Radix Opener Content
              <div className="mt-4 flex flex-col gap-4">
                <RadixAlertOpener.Trigger>Radix AlertOpener 👍</RadixAlertOpener.Trigger>
                <RadixAlertOpener.Root>
                  <RadixAlertOpener.Trigger>Inner Radis AlertOpener 👍</RadixAlertOpener.Trigger>
                  <RadixAlertOpener.Content className="mt-4 whitespace-nowrap">
                    This is inner of inner alert-content
                    <RadixAlertOpener.ContentSize />
                  </RadixAlertOpener.Content>
                </RadixAlertOpener.Root>
              </div>
            </RadixOpener.Content>
          </RadixOpener.Root>
          <RadixAlertOpener.Content className="mt-24">
            <RadixAlertOpener.ContentSize />
          </RadixAlertOpener.Content>
        </RadixAlertOpener.Root>
      </Box>
    </div>
  );
}

export default App;
