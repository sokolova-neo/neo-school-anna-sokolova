import axios from 'axios';
import { GraphQLDataSource, ServiceEndpointDefinition } from '@apollo/gateway';

import { asyncLogger as logger } from '@neofinancial/neo-framework';

import { AdminServiceDataSource } from './service-data-source';

type ServiceConfig = { name: string; url: string };
export type ServiceList = ServiceConfig[];

const statusCheck = async (service: ServiceConfig, axiosClient = axios): Promise<ServiceConfig | undefined> => {
  return new Promise((resolve) => {
    if (service.url) {
      axiosClient
        .get(service.url.replace('graphql', 'status'), { timeout: 500 })
        .then(() => {
          return resolve(service);
        })
        .catch(() => {
          logger.info(`Skipping ${service.name} at ${service.url}`);

          return resolve(void 0);
        });
    } else {
      resolve(void 0);
    }
  });
};

const getServices = async (
  allServices: ServiceList
): Promise<{ runningServices: ServiceList; offlineServices: ServiceList }> => {
  const statusChecks = allServices.map((service) => statusCheck(service));
  const services = await Promise.all(statusChecks);
  const onlineServices = services.filter(<TValue>(value: TValue | undefined): value is TValue => value !== undefined);
  const onlineServiceNames = new Set(onlineServices.map((service) => service.name));
  const offlineServices = allServices.filter((service) => !onlineServiceNames.has(service.name));

  return { runningServices: onlineServices, offlineServices };
};

const buildService = (): ((serviceConfig: ServiceEndpointDefinition) => GraphQLDataSource) => {
  const buildService = (serviceConfig: ServiceEndpointDefinition): GraphQLDataSource => {
    logger.info(`Connecting to ${serviceConfig.name} at ${serviceConfig.url}!`);

    return new AdminServiceDataSource(serviceConfig);
  };

  return buildService;
};

export { buildService, statusCheck, getServices };
