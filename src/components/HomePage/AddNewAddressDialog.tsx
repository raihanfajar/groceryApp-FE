import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddNewAddressDialog = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full cursor-pointer bg-green-700" type="button">
            Add Address
          </Button>
        </DialogTrigger>
        <DialogContent className="flex h-[600px] flex-col sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader className="h-fit">
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Choose and edit your location that suited you.
            </DialogDescription>
          </DialogHeader>
          <div className="h-full">Testing</div>
          <DialogFooter className="mt-auto">
            <Button
              className="w-full cursor-pointer bg-green-700"
              type="button"
            >
              HAHA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewAddressDialog;
