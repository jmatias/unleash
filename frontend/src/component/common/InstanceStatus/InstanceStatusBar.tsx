import { styled, Button, Typography } from '@mui/material';
import { type IInstanceStatus, InstancePlan } from 'interfaces/instance';
import { INSTANCE_STATUS_BAR_ID } from 'utils/testIds';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import WarningAmber from '@mui/icons-material/WarningAmber';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AccessContext from 'contexts/AccessContext';
import { ADMIN } from 'component/providers/AccessProvider/permissions';
import {
    trialHasExpired,
    trialExpiresSoon,
    isTrialInstance,
} from 'utils/instanceTrial';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import useUiConfig from '../../../hooks/api/getters/useUiConfig/useUiConfig.ts';

const StyledWarningBar = styled('aside')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    borderBottom: '1px solid',
    borderColor: theme.palette.warning.border,
    background: theme.palette.warning.light,
    color: theme.palette.warning.dark,
}));

const StyledInfoBar = styled('aside')(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
    borderBottom: '1px solid',
    borderColor: theme.palette.info.border,
    background: theme.palette.info.light,
    color: theme.palette.info.dark,
}));

const StyledButton = styled(Button)(({ theme }) => ({
    whiteSpace: 'nowrap',
    minWidth: '8rem',
    marginLeft: theme.spacing(2),
}));

const StyledWarningIcon = styled(WarningAmber)(({ theme }) => ({
    color: theme.palette.warning.main,
}));

const StyledInfoIcon = styled(InfoOutlined)(({ theme }) => ({
    color: theme.palette.info.main,
}));

interface IInstanceStatusBarProps {
    instanceStatus: IInstanceStatus;
}

export const InstanceStatusBar = ({
    instanceStatus,
}: IInstanceStatusBarProps) => {
    if (trialHasExpired(instanceStatus)) {
        return <StatusBarExpired instanceStatus={instanceStatus} />;
    }

    if (trialExpiresSoon(instanceStatus)) {
        return <StatusBarExpiresSoon instanceStatus={instanceStatus} />;
    }

    if (isTrialInstance(instanceStatus)) {
        return <StatusBarExpiresLater instanceStatus={instanceStatus} />;
    }

    return null;
};

const StatusBarExpired = ({ instanceStatus }: IInstanceStatusBarProps) => {
    return (
        <StyledWarningBar data-testid={INSTANCE_STATUS_BAR_ID}>
            <StyledWarningIcon />
            <Typography
                sx={(theme) => ({ fontSize: theme.fontSizes.smallBody })}
            >
                <strong>Warning!</strong> Your free {instanceStatus.plan} trial
                has expired. <strong>Upgrade trial</strong> otherwise your{' '}
                <strong>account will be deleted.</strong>
            </Typography>
            <BillingLink instanceStatus={instanceStatus} />
        </StyledWarningBar>
    );
};

const StatusBarExpiresSoon = ({ instanceStatus }: IInstanceStatusBarProps) => {
    const timeRemaining = formatDistanceToNowStrict(
        parseISO(instanceStatus.trialExpiry!),
        { roundingMethod: 'floor' },
    );

    return (
        <StyledInfoBar data-testid={INSTANCE_STATUS_BAR_ID}>
            <StyledInfoIcon />
            <Typography
                sx={(theme) => ({ fontSize: theme.fontSizes.smallBody })}
            >
                <strong>Heads up!</strong> You have{' '}
                <strong>{timeRemaining}</strong> left of your free{' '}
                {instanceStatus.plan} trial.
            </Typography>
            <BillingLink instanceStatus={instanceStatus} />
        </StyledInfoBar>
    );
};

const StatusBarExpiresLater = ({ instanceStatus }: IInstanceStatusBarProps) => {
    return (
        <StyledInfoBar data-testid={INSTANCE_STATUS_BAR_ID}>
            <StyledInfoIcon />
            <Typography
                sx={(theme) => ({ fontSize: theme.fontSizes.smallBody })}
            >
                <strong>Heads up!</strong> You're currently on a free{' '}
                {instanceStatus.plan} trial account.
            </Typography>
            <BillingLink instanceStatus={instanceStatus} />
        </StyledInfoBar>
    );
};

const BillingLink = ({ instanceStatus }: IInstanceStatusBarProps) => {
    const { hasAccess } = useContext(AccessContext);
    const { uiConfig } = useUiConfig();
    const navigate = useNavigate();

    if (!hasAccess(ADMIN)) {
        return null;
    }

    if (
        instanceStatus.plan === InstancePlan.ENTERPRISE &&
        uiConfig.billing !== 'pay-as-you-go'
    ) {
        return null;
    }

    return (
        <StyledButton
            onClick={() => navigate('/admin/billing')}
            variant='outlined'
        >
            Upgrade trial
        </StyledButton>
    );
};
