import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Session, useSessionStore } from "../stores/useSessionStore";
import toast from "react-hot-toast";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ContinueLastSession = () => {
  const { current, history, continueLastSession, finishIncompleteSession } =
    useSessionStore();
  const [open, setOpen] = React.useState(
    history.length > 0 && !history[history.length - 1].isCompleted && !current
  );
  const lastSession = history[history.length - 1];

  const handleClose = async () => {
    if (lastSession.id) {
      await finishIncompleteSession(lastSession.id);
      toast.error("Previous session marked as incomplete.");
    }
    setOpen(false);
  };

  const handleContinue = () => {
    const lastSession = history[history.length - 1];
    continueLastSession(lastSession);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Incomplete Session Detected"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You have an unfinished session titled{" "}
            <strong>{lastSession.title}</strong>. Would you like to continue
            where you left off?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Discard</Button>
          <Button onClick={handleContinue}>Continue</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ContinueLastSession;
