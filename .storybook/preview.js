import { parameters as nuxtParameters } from '~~/.nuxt-storybook/storybook/preview.js'
import '~~/.nuxt-storybook/storybook/preview.js'
import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);
const vuetify = new Vuetify(options);

export const parameters = {
  ...nuxtParameters,
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#333333',
      }
    ],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // here don't work. issue: https://github.com/nuxt-community/storybook/issues/205
  // docs: {
  //   source: {
  //     type: 'dynamic'
  //   }
  // }
}

export const decorators = [
  (story, context) => {
    const wrapped = story(context);
    return Vue.extend({
      vuetify,
      components: { wrapped },
      template: `
        <v-app>
          <v-container fluid>
            <wrapped />
          </v-container>
        </v-app>
      `,
    });
  },
];