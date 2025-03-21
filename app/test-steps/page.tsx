const TestSteps = () => {
  return (
    <div className="mx-auto max-w-2xl p-4 md:p-6 lg:p-8">
      {/* First set of steps */}
      <div className="steps mb-8">
        <h2 className="text-2xl font-bold mb-6">Installation Guide</h2>

        <h3>Download the package</h3>
        <p>
          First, download the package from npm using your preferred package
          manager.
        </p>

        <h3>Configure your environment</h3>
        <p>Set up your environment variables and configuration files.</p>

        <h3>Run the setup script</h3>
        <p>Execute the setup script to complete the installation.</p>
      </div>

      {/* Second set of steps (counter resets automatically) */}
      <div className="steps">
        <h2 className="text-2xl font-bold mb-6">Usage Guide</h2>

        <h3>Import the components</h3>
        <p>Import the necessary components into your project.</p>

        <h3>Add the markup</h3>
        <p>Add the required HTML markup to your templates.</p>

        <h3>Style your components</h3>
        <p>Customize the appearance using the provided CSS classes.</p>

        <h3>Test the implementation</h3>
        <p>Verify that everything works as expected.</p>
      </div>
    </div>
  );
};

export default TestSteps;
