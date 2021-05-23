import { ExceptionCollector } from 'browser-exception-collector';

const collector = new ExceptionCollector();

collector.onError(error => {
  console.error('onError', error);
  console.log('onError', JSON.parse(error.toJSON()));
});

collector.onUnhandledRejection(error => {
  console.error('onUnhandledRejection', error);
  console.log('onUnhandledRejection', JSON.parse(error.toJSON()));
});
