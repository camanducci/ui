import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';

let notFound= {};

export default Component.extend({
  layout,
  clusterStore: service(),
  environmentId: null,
  loading: true,
  env: null,
  onlyType: null,

  tagName: '',

  init() {
    this._super();

    const cs = this.get('clusterStore');

    let id = this.get('environmentId');
    let onlyType = this.get('onlyType');

    this.setProperties({
      loading: true,
      env: null
    });

    let env = cs.getById('project', id);
    if ( env || notFound[id] ) {
      this.setProperties({
        env: env,
        loading: false,
      });
      return;
    }

    if ( id ) {
      cs.find('project', id).then((env) => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }

        if ( !onlyType || env.get('type').toLowerCase() === onlyType.toLowerCase() )
        {
          this.set('env', env);
        }
      }).catch(() => {
        notFound[id] = true;

        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }

        this.set('env', null);
      }).finally(() => {
        if ( this.isDestroyed || this.isDestroying ) {
          return;
        }

        this.set('loading', false);
      });
    } else {
      this.set('loading',false);
    }
  }
});
