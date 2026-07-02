import React from 'react';
import { fetchDashboard } from '../api/client';
import { getAccount } from '../storage/accountStorage';
import ValorantWidget from './ValorantWidget';

export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const account = await getAccount();
      
      if (!account) {
        props.renderWidget(<ValorantWidget dashboard={null} />);
        return;
      }

      try {
        const dashboard = await fetchDashboard(account.region, account.name, account.tag);
        // Direct, light data delivery to your UI component
        props.renderWidget(<ValorantWidget dashboard={dashboard} />);
      } catch (e) {
        props.renderWidget(<ValorantWidget dashboard={null} />);
      }
      break;
    }
    case 'WIDGET_DELETED':
      break;
    default:
      break;
  }
}