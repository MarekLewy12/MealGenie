import { OnboardingForm } from './components/OnboardingForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-16">
        <OnboardingForm />
      </div>
    </div>
  );
}

export default App;
