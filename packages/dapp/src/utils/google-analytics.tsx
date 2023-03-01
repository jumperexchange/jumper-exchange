import ReactGA from 'react-ga';

type GaEventTrackType = {
  category: string;
  action: string;
  label: string;
  value?: number;
  nonInteraction?: boolean;
  transport?: 'xhr' | 'beacon' | 'image';
};

export const gaEventTrack = (data: GaEventTrackType) => {
  // console.log('GA event:', data.category, ':', data.action, ':', data.label);
  ReactGA.event({
    category: data.category, // category: "your category",
    action: data.action, // action: "your action",
    label: data.label, // label: "your label", // optional
    value: data.value ? data.value : undefined, // value: 99, // optional, must be a number
    nonInteraction: data.nonInteraction ? data.nonInteraction : undefined, // nonInteraction: true, // optional, true/false
    transport: data.transport ? data.transport : undefined, // transport: "xhr", // optional, beacon/xhr/image
  });
};
