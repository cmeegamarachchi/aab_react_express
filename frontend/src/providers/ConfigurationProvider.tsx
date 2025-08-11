import React, { useEffect, useState } from "react";

interface Configuration {
	apiBaseUrl: string;
	numberOfItemsPerPage: number;
	apiKey: string;
	theme: string;
}

const defaultConfiguration: Configuration = {
	apiBaseUrl: '',
	numberOfItemsPerPage: 15,
	apiKey:'not-set',
	theme: 'system'
}

interface ConfigurationStoreProps {
	configuration: Configuration;
	setConfiguration: (data: Configuration) => void;
}

const defaultConfigurationStoreProps: ConfigurationStoreProps = {
	configuration: defaultConfiguration,
	setConfiguration: (data: Configuration) => { console.dir(data); }
}

const ConfigurationStoreContext = React.createContext<ConfigurationStoreProps>(defaultConfigurationStoreProps);
ConfigurationStoreContext.displayName = "ConfigurationStoreContext";

export const ConfigurationProvider = (props: any) => {
	const [_configuration, _setConfiguration] = useState<Configuration>(() => {
		const localData = localStorage.getItem('configuration');
		return localData ? JSON.parse(localData) : defaultConfiguration;
	});

	useEffect(() => {
		console.log('Configuration updated', _configuration);
		localStorage.setItem('configuration', JSON.stringify(_configuration));
	}, [_configuration]);

	return <ConfigurationStoreContext.Provider value={{ configuration:_configuration, setConfiguration: _setConfiguration }} {...props} />
}

export const useConfiguration = () => {
	const dataContext = React.useContext(ConfigurationStoreContext);

	if (dataContext) {
		return dataContext;
	} else {
		throw Error('Value context should be used within Provider');
	}
}