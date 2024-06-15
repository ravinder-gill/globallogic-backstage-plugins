import React, { useEffect } from 'react';
import { Grid, IconButton, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ResponseErrorPanel } from '@backstage/core-components';
import { TerraformLatestRunContent } from '../TerraformLatestRunContent';
import { useRuns } from '../../hooks';
import { Run } from '../../hooks/types';
import {
  isTerraformAvailable,
  TERRAFORM_WORKSPACE_ANNOTATION,
  TERRAFORM_WORKSPACE_ORGANIZATION,
} from '../../annotations';
import { MissingAnnotationEmptyState, useEntity } from '@backstage/plugin-catalog-react';


export const TerraformLatestRun = () => {

  const { entity } = useEntity();

  const { annotations } = entity.metadata;
  const organization = annotations?.[TERRAFORM_WORKSPACE_ORGANIZATION] ?? 'undefined';
  const workspaceName = annotations?.[TERRAFORM_WORKSPACE_ANNOTATION] ?? 'undefined';

  const { data, isLoading, isError, error, refetch } = useRuns(organization, workspaceName);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (!isTerraformAvailable(entity)) {
    return (
      <MissingAnnotationEmptyState
        annotation={[TERRAFORM_WORKSPACE_ANNOTATION]}
      />
    );
  }

  console.log('[TerraformLatestRun] data:', data);
  console.log('[TerraformLatestRun] isLoading:', isLoading);
  console.log('[TerraformLatestRun] isError:', isError);
  console.log('[TerraformLatestRun] error:', error);



  if (error) {
    return <ResponseErrorPanel error={error} />;
  }


  if (isLoading) {
    return (
      <>
        {`Getting data for workspace ${workspaceName}`}
      </>
    )
  }

  const latestRun: Run | undefined = data ? data[0] : undefined

  if (!latestRun) {
    return (
      <>
        {`No runs for ${workspaceName}`}
      </>
    );
  };


  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Grid
          container
          direction="row"
          spacing={0}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5">Terraform</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={refetch} aria-label="Refresh">
              <RefreshIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            This contains some useful information around the terraform workspace
            "{workspaceName}".
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <TerraformLatestRunContent run={latestRun} workspace={workspaceName} />
      </Grid>
    </Grid>
  )

};
