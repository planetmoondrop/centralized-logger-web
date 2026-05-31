import nextra from "nextra";

// Set up Nextra with its configuration
const withNextra = nextra({
  search: { codeblocks: false },
});

// Export the final Next.js config with Nextra included
export default withNextra({
  redirects: async () => [
    {
      source: "/support-us",
      destination: "/docs/support-us",
      permanent: false,
    },
  ],
});
