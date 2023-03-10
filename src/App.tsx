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
    <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 gap-x-10 gap-y-40 sm:grid-cols-2">
      <Box title="Opener in AlertOpener component" subTitle="not work properly 👎">
        <AlertOpener.Root>
          <Opener.Root>
            <Opener.Trigger>Opener</Opener.Trigger>
            <Opener.Content>
              Opener Content
              <AlertOpener.Trigger className="ml-2">AlertOpener</AlertOpener.Trigger>
            </Opener.Content>
          </Opener.Root>
          <AlertOpener.Content>AlertOpener Content</AlertOpener.Content>
        </AlertOpener.Root>
      </Box>

      <Box title="Opener in AlertOpener component (brute-force)" subTitle="work preperly! 👍">
        <AdvancedAlertOpener.Root>
          <AdvancedOpener.Root>
            <AdvancedOpener.Trigger>Opener</AdvancedOpener.Trigger>
            <AdvancedOpener.Content>
              Opener Content
              <AdvancedAlertOpener.Trigger className="ml-2">
                AlertOpener
              </AdvancedAlertOpener.Trigger>
            </AdvancedOpener.Content>
          </AdvancedOpener.Root>
          <AdvancedAlertOpener.Content className="mt-24">
            AlertOpener Content
          </AdvancedAlertOpener.Content>
        </AdvancedAlertOpener.Root>
      </Box>

      <Box
        title="Opener in AlertOpener component (createContextScope by radix-ui)"
        subTitle="work preperly! 👍"
      >
        <RadixAlertOpener.Root>
          <RadixOpener.Root>
            <RadixOpener.Trigger>Opener</RadixOpener.Trigger>
            <RadixOpener.Content>
              Opener Content
              <RadixAlertOpener.Trigger className="ml-2">AlertOpener</RadixAlertOpener.Trigger>
            </RadixOpener.Content>
          </RadixOpener.Root>
          <RadixAlertOpener.Content className="mt-24">AlertOpener Content</RadixAlertOpener.Content>
        </RadixAlertOpener.Root>
      </Box>

      <Box title="more complex (createContextScope by radix-ui)" subTitle="work preperly! 👍">
        <RadixAlertOpener.Root>
          <RadixOpener.Root>
            <RadixOpener.Trigger>Opener</RadixOpener.Trigger>
            <RadixOpener.Content>
              Opener Content
              <div className="mt-4 flex flex-col gap-4">
                <RadixAlertOpener.Trigger>AlertOpener</RadixAlertOpener.Trigger>
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
