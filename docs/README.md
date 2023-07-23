# Octopus

Octopus is made to setup anything in a simple way. It could be understood as an alternative to [Terraform](https://github.com/hashicorp/terraform), [Pulumi](https://github.com/pulumi/pulumi), etc. Octopus can operate systems by their own APIs (like Terraform do), but without need to keep any separated state (such as [`.tfstate` file](https://developer.hashicorp.com/terraform/language/state)). All infrastructure state is the configuration files, it makes operation more simpler than Terraform. With Octopus the configuration files is the source of truth.

![logo](./logo.png)

Octopus is completely written in JavaScript and uses the [Handlebars](https://github.com/handlebars-lang/handlebars.js/) powers to provide a template language. Octopus is extensible, [supports additional plugins](#creating-a-plugin) and has some [built-in helpers](#built-in-helpers) to do common things like reading file contents, reading environment variables, and so on.

## How to use it?

To use Octopus, the first thing is to understand how does the [lifecycles](#lifecycles) works. After that, it is necessary to choose a [plugin](#plugin-list) and specify the plugin resources by writing configuration files. It is possible to use [helpers](#built-in-helpers) to write configuration files too.

### Lifecycles

The main objective of defining the Octopus lifecycles is to make a standard operation, independent of each system and, at the same time, respecting its particularities. Actually, Octopus has two lifecycles:

1. [Update Resources Lifecycle](#update-resources-lifecycle): Used to keep already created resources and just modify them as per config file data. It is enabled by default or when setting the `recreate="false"` argument; or 
2. [Recreate Resources Lifecycle](#recreate-resources-lifecycle): Used to recreate resource on every execution. It is enabled when setting the `recreate="true"` argument.

Some plugins could not support `recreate="false"` lifecycle, this infomation can be found at the plugin docs.  

#### Update Resources Lifecycle

The lifecycle of update resources has the following lifecycle:



#### Recreate Resources Lifecycle

The lifecycle of recreate resources has the following lifecycle:


### Plugin List

Nowadays Octopus supports operation for these systems as plugins:

|**System**|**Plugin**|**Description**|**Docs**|
|-|-|-|-|
|[Airbyte](https://airbyte.com/)|`airbyte`|Read `workflows` and Manage `sources`, `destinations` and `connections` by [Airbyte Cloud API](https://reference.airbyte.com/reference/start). It is an alternative for the official [Airbyte Octavia CLI](https://github.com/airbytehq/airbyte/tree/master/octavia-cli).|[click here](../src//plugins/airbyte/docs/README.md)|
|[Airflow](https://airflow.apache.org/)|`airflow`|Manage `variables`, `connections`, `pools`, `users` and `roles` by [Airflow API](https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html).|[click here](../src//plugins/airflow/docs/README.md)|
|[Github](https://github.com/)|`github`|Read `workflows` by [Github API](https://docs.github.com/en/rest).|[click here](../src//plugins/github/docs/README.md)|
|[Badger](https://infra-lake.github.io/badger/)|`badger`|Manage `sources` and `targets` by Badger API.|[click here](../src//plugins/badger/docs/README.md)|

### Built-in Helpers



### Resources

## How to contribute?

### Creating a plugin

<!-- o que é?
por que existe?
como usar?
como contribuir? -->