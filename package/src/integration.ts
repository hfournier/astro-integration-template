import { defineIntegration, addVirtualImports } from "astro-integration-kit";

export const integration = defineIntegration({
  name: "astro-seo-max",
  setup({ name }) {
    return {
      hooks: {
        "astro:config:setup": (params) => {
          addVirtualImports(params, {
            name,
            imports: {
              "astro-seo-max/config": `export default ${JSON.stringify({
                foo: "bar",
              })}`,
            },
          });
        },
      },
    };
  },
});
