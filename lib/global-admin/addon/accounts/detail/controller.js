import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { get, computed /* , set */ } from '@ember/object';

export default Controller.extend({
  externalUtils:      service(),
  router:             service(),

  sortGlobalBy: 'name',
  globalHeaders: [
    {
      name: 'enabled',
      searchField: null,
      width: 30
    },
    {
      name: 'name',
      sort: ['globalRole.displayName'],
      searchField: 'globalRole.displayName',
      translationKey: 'accountsPage.detail.table.headers.permission',
    },
    {
      name: 'created',
      searchField: null,
      sort: ['createdTs'],
      translationKey: 'accountsPage.detail.table.headers.created',
      width: 200,
    },
  ],

  sortClusterBy: 'name',
  clusterHeaders:  [
    {
      name: 'clusterName',
      searchField: 'cluster.displayName',
      sort: ['cluster.displayName', 'project.displayName'],
      translationKey: 'accountsPage.detail.table.headers.clusterName',
    },
    {
      name: 'name',
      searchField: 'roleTemplate.displayName',
      sort: ['roleTemplate.displayNAme'],
      translationKey: 'accountsPage.detail.table.headers.role',
    },
    {
      name: 'created',
      searchField: null,
      sort: ['createdTs'],
      translationKey: 'accountsPage.detail.table.headers.created',
      width: 200,
    },
  ],

  sortProjectBy: 'projectName',
  projectHeaders:  [
    {
      name: 'projectName',
      searchField: 'project.displayName',
      sort: ['project.displayName', 'displayName'],
      translationKey: 'accountsPage.detail.table.headers.projectName',
    },
    {
      name: 'name',
      searchField: 'roleTemplate.displayName',
      sort: ['roleTemplate.displayName','project.displayName'],
      translationKey: 'accountsPage.detail.table.headers.role',
    },
    {
      name: 'created',
      searchField: null,
      sort: ['createdTs'],
      translationKey: 'accountsPage.detail.table.headers.created',
      width: 200,
    },
  ],

  globalRoleMapping: computed('model.user.globalRoleBindings.[]','model.globalRoles', function() {
    let out = (get(this, 'model.globalRoles')||[]).filterBy('isHidden', false).map(role => {
      return { role, enabled: false };
    });

    (get(this, 'model.user.globalRoleBindings')||[]).forEach((binding) => {
      let entry = out.findBy('role', get(binding, 'globalRole'));
      if ( entry ) {
        entry.enabled = true;
        entry.binding = binding;
      }
    });

    return out;
  }),

  actions: {
    launchOnCluster(project) {
      get(this, 'externalUtils').switchProject(get(project, 'id'), 'authenticated.project', [project.clusterId, {queryParams: {backTo: 'global.accounts'}}]);
    },
  },
});
