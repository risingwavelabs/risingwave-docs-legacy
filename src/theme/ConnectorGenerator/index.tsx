import React, { useState, Fragment, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import CodeBlock from "@theme/CodeBlock";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useColorMode } from "@docusaurus/theme-common";

import sleep from "../../utils/sleep";
import styles from "./styles.module.css";

import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";

import {
  SSLSettings,
  kafkaInitialdata,
} from "./schemas/Source-Kafka/Source-Kafka";
import {
  Connectors,
  Sinks,
  mapToInitialdata,
  mapToSchema,
  mapToUISchema,
} from "./schemas/store";

type ConnectorType = "Source" | "Sink";

type SourceData = {
  [key: string]: any;
};

type Props = {};
export const ConnectorGenerator = ({}: Props) => {
  const [loading, setLoading] = useState(false);
  const [connector, setConnectoer] = useState("Kafka");
  const [data, setData] = useState<SourceData>(kafkaInitialdata);
  const [connectorType, setConnectorType] = useState<ConnectorType>("Source");

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectorType((event.target as HTMLInputElement).value as ConnectorType);
  };

  const handleConnectorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConnectoer((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    setData(mapToInitialdata.get(`${connectorType}-${connector}`));
  }, [connector, connectorType]);

  useEffect(() => {
    setConnectoer("Kafka");
  }, [connectorType]);

  const { colorMode } = useColorMode();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
        },
      }),
    [colorMode]
  );

  const generateSSLSetting = (data: SourceData) => {
    if (data?.SSLandSSALSettings === SSLSettings[0]) {
      return `
  properties.security.protocol='SSL',
  properties.ssl.ca.location='/home/ubuntu/kafka/secrets/ca-cert',
  properties.ssl.certificate.location='/home/ubuntu/kafka/secrets/client_risingwave_client.pem',
  properties.ssl.key.location='/home/ubuntu/kafka/secrets/client_risingwave_client.key',
  properties.ssl.key.password='abcdefgh'`;
    } else if (data?.SSLandSSALSettings === SSLSettings[1]) {
      return `
  properties.sasl.mechanism='PLAIN',
  properties.security.protocol='SASL_PLAINTEXT',
  properties.sasl.username='admin',
  properties.sasl.password='admin-secret'`;
    } else if (data?.SSLandSSALSettings === SSLSettings[2]) {
      return `
  properties.sasl.mechanism='SCRAM-SHA-256',
  properties.security.protocol='SASL_PLAINTEXT',
  properties.sasl.username='admin',
  properties.sasl.password='admin-secret'`;
    } else if (data?.SSLandSSALSettings === SSLSettings[3]) {
      return `
   properties.sasl.mechanism='GSSAPI',
   properties.security.protocol='SASL_PLAINTEXT',
   properties.sasl.kerberos.service.name='kafka',
   properties.sasl.kerberos.keytab='/etc/krb5kdc/kafka.client.keytab',
   properties.sasl.kerberos.principal='kafkaclient4@AP-SOUTHEAST-1.COMPUTE.INTERNAL',
   properties.sasl.kerberos.kinit.cmd='sudo kinit -R -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal} || sudo kinit -kt "%{sasl.kerberos.keytab}" %{sasl.kerberos.principal}',
   properties.sasl.kerberos.min.time.before.relogin='10000'`;
    } else if (data?.SSLandSSALSettings === SSLSettings[4]) {
      return `
  properties.sasl.mechanism='OAUTHBEARER',
  properties.security.protocol='SASL_PLAINTEXT',
  properties.sasl.oauthbearer.config='principal=bob'`;
    } else return "";
  };

  const generateConnectorURL = (data: SourceData) => {
    if (data?.bootstrapServers) {
      return `properties.bootstrap.server='${data?.bootstrapServers}',`;
    } else if (data?.serviceURL) {
      return `service.url='${data?.serviceURL}',
  admin.url='${data?.adminURL}'`;
    } else if (data?.AWSRegion && data?.serviceEntryPointURL) {
      return `aws.region='${data?.AWSRegion || "user_test_topic"}'
  endpoint='${data?.serviceEntryPointURL || "172.10.1.1:9090,172.10.1.2:9090"}',
  aws.credentials.session_token='${data?.AWSSessionToken}',
  aws.credentials.role.arn='${data?.IAMRoleARN}',
  aws.credentials.role.external_id='${data?.externalID}'`;
    } else {
      return `connector_parameter='value', ...`;
    }
  };

  const generateLocation = (data: SourceData) => {
    if (data?.schemaLocation) {
      return `'${data?.schemaLocation}'`;
    } else if (data?.confluentSchemaRegistryURL) {
      return `'CONFLUENT SCHEMA REGISTRY ${data?.confluentSchemaRegistryURL}'`;
    } else {
      return "'location'";
    }
  };

  const generateConnectionCode = () => {
    // CDC
    if (connector === "MySQL CDC") {
      return `CREATE TABLE source_name (
  ${data?.sourceSchema
    ?.map(
      (d) =>
        `${d.columnName}  ${d.dataType} ${
          d.selectAsPrimaryKey ? "PRIMARY KEY" : ""
        }`
    )
    .join(",\n  ")}
) 
WITH (
  connector='mysql-cdc',
  hostname = '${data?.host}',
  port = '${data?.port}',
  username = '${data?.username}',
  password = '${data?.password}',
  database.name = '${data?.databaseName}',
  table.name = '${data?.tableName}',
  server.id = '${data?.serverID}'
)
ROW FORMAT DEBEZIUM_JSON;`;
    }

    if (connector === "PostgreSQL CDC") {
      return `CREATE TABLE source_name (
  ${data?.sourceSchema
    ?.map(
      (d) =>
        `${d.columnName}  ${d.dataType} ${
          d.selectAsPrimaryKey ? "PRIMARY KEY" : ""
        }`
    )
    .join(",\n  ")}
) WITH (
  connector = 'postgres-cdc',
  hostname = '${data?.host}',
  port = '${data?.port}',
  username = '${data?.username}',
  password = '${data?.password}',
  database.name = '${data?.databaseName}',
  schema.name = '${data?.schemaName}',
  table.name = '${data?.tableName}',
  slot.name = '${data?.slotName}'
);`;
    }

    // S3
    if (connector === "S3") {
      return `CREATE TABLE s(
  ${data?.sourceSchema
    ?.map(
      (d) =>
        `${d.columnName}  ${d.dataType} ${
          d.selectAsPrimaryKey ? "PRIMARY KEY" : ""
        }`
    )
    .join(",\n  ")}
) WITH (
    connector = 's3',
    s3.region_name = '${data?.regionName || "region_name"}',
    s3.bucket_name = '${data?.bucketName || "bucket_name"}',
    s3.credentials.access = '${data?.AWSAccessKeyID}',
    s3.credentials.secret = '${data?.AWSSecretAccessKey}'
) ROW FORMAT csv WITHOUT HEADER DELIMITED BY ',';`;
    }

    // JSON
    if (data?.rowFormat === "JSON") {
      return `CREATE TABLE IF NOT EXISTS ${
        data?.sourceName || data?.name || `${connectorType?.toLowerCase()}_name`
      } (
  ${data?.sourceSchema
    ?.map(
      (d) =>
        `${d.columnName}  ${d.dataType} ${
          d.selectAsPrimaryKey ? "PRIMARY KEY" : ""
        }`
    )
    .join(",\n  ")}
)
WITH (
  connector='${connector.toLowerCase()}',${
        data?.stream ? `\n  stream='${data?.stream}'` : ""
      }
  topic='${data?.topic || "demo_topic"}', 
  ${generateConnectorURL(data)},${
        data?.scanStartupMode
          ? `\n  scan.startup.mode='${
              data?.scanStartupMode?.toLowerCase() || "earliest"
            },`
          : ""
      }${
        data?.startupTimestampOffset
          ? `\n  scan.startup.timestamp_millis='${
              data?.startupTimestampOffset || 1400000
            }',`
          : ""
      }
)
ROW FORMAT JSON;`;
    }

    // Avro, Protobuf
    return `CREATE ${connectorType?.toUpperCase()} IF NOT EXISTS ${
      data?.sourceName || `${connectorType?.toLowerCase()}_name`
    } 
WITH (
  connector='${connector?.toLowerCase()}',${
      data?.stream ? `\n  stream='${data?.stream}',` : ""
    }
  topic='${data?.topic || "demo_topic"}', 
  ${generateConnectorURL(data)}${
      data?.scanStartupMode
        ? `scan.startup.mode='${
            data?.scanStartupMode?.toLowerCase() || "earliest"
          },`
        : ""
    }${
      data?.startupTimestampOffset
        ? `\n  scan.startup.timestamp_millis='${
            data?.startupTimestampOffset || 1400000
          }',`
        : ""
    }${generateSSLSetting(data)}
) 
ROW FORMAT ${data?.rowFormat?.toUpperCase() || "JSON"} ${
      data?.message ? "MESAAGE '" + data?.message + "'" : ""
    }
ROW SCHEMA LOCATION ${generateLocation(data)};`;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={styles.mainContainer}>
        <FormControl className={styles.formContainer}>
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            className={styles.labelText}
          >
            Connector type:
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={connectorType}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value="Source"
              control={<Radio />}
              label="Source"
              className={styles.radioLabel}
            />
            <FormControlLabel
              value="Sink"
              control={<Radio />}
              label="Sink"
              className={styles.radioLabel}
            />
          </RadioGroup>
        </FormControl>
        <Divider light sx={{ marginTop: "1rem" }} />
        <Typography variant="h5" gutterBottom className={styles.header}>
          {connectorType === "Source" ? "Create source" : "Create sink"}
        </Typography>

        <FormControl
          variant="standard"
          sx={{ mt: 1.5, minWidth: 350 }}
          fullWidth
        >
          <Stack sx={{ width: "50%" }} mb={1}>
            <InputLabel id="demo-simple-select-standard-label">
              Select connector
            </InputLabel>
            <Select
              fullWidth
              className={styles.selectConnector}
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={connector}
              onChange={handleConnectorChange}
              label="Connector"
            >
              {connectorType === "Source"
                ? Connectors?.map((conn, idx) => (
                    <MenuItem value={conn} key={idx}>
                      {conn}
                    </MenuItem>
                  ))
                : Sinks?.map((conn, idx) => (
                    <MenuItem value={conn} key={idx}>
                      {conn}
                    </MenuItem>
                  ))}
            </Select>
          </Stack>

          {mapToSchema.get(`${connectorType}-${connector}`) && (
            <div className="jsonForms">
              <JsonForms
                key={`${connectorType}-${connector}`}
                schema={mapToSchema.get(`${connectorType}-${connector}`)}
                uischema={mapToUISchema.get(`${connectorType}-${connector}`)}
                data={data}
                renderers={materialRenderers}
                cells={materialCells}
                onChange={({ data, errors }) => setData(data)}
              />
            </div>
          )}
        </FormControl>
        <Stack flexDirection="row" justifyContent="end" my={2}>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<RocketLaunchIcon />}
            variant="contained"
            onClick={() => {
              setLoading(true);
              sleep(1000).then(() => {
                setLoading(false);
              });
            }}
          >
            Generate SQL statement
          </LoadingButton>
        </Stack>
        <CodeBlock language="sql">{generateConnectionCode()}</CodeBlock>
      </Box>
    </ThemeProvider>
  );
};

export default ConnectorGenerator;
