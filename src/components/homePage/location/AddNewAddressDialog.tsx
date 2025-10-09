// AddNewAddressDialog.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddNewAddress } from "@/hooks/home/useAddNewAddress";
import { useRajongCity } from "@/hooks/rajong/useRajongCity";
import { useRajongDistrict } from "@/hooks/rajong/useRajongDistrict";
import { useRajongProvince } from "@/hooks/rajong/useRajongProvince";
import { useActualLocationStore } from "@/store/useLocationStore";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { addNewAddressSchema } from "@/validation/addNewAddressVS";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { AddNewAddressDialogFormValues } from "../typesAndInterfaces";
import AddNewAddressDialogFormField from "./AddNewAddressDialogFormField";
import { RajongSelectGroup } from "./RajongSelectGroup";

const MapLeaflet = dynamic(() => import("./MapLeaflet"), { ssr: false });
declare global {
  interface Window {
    __LEAFLET_MAP__?: import("leaflet").Map;
  }
}
const inputBaseCn =
  "focus:outline-none focus-visible:border-green-500 focus-visible:ring-0 focus-visible:ring-offset-0";

const AddNewAddressDialog = () => {
  const [dialogKey, setDialogKey] = useState(0);
  const { accessToken } = useUserAuthStore();

  const [provinceId, setProvinceId] = useState("");
  const [cityId, setCityId] = useState("");
  const [districtId, setDistrictId] = useState("");

  const { data: provinces = [] } = useRajongProvince();
  const { data: cities = [] } = useRajongCity(provinceId);
  const { data: districts = [] } = useRajongDistrict(cityId);

  const updateLocation = (
    id: string,
    list: { id: number; name: string }[],
    idKey: keyof AddNewAddressDialogFormValues,
    nameKey: keyof AddNewAddressDialogFormValues,
  ) => {
    const name = list.find((x) => String(x.id) === id)?.name ?? "";
    formik.setFieldValue(idKey, id);
    formik.setFieldValue(nameKey, name);
  };

  useEffect(() => {
    updateLocation(provinceId, provinces, "provinceId", "province");
  }, [provinceId]);

  useEffect(() => {
    updateLocation(cityId, cities, "cityId", "city");
  }, [cityId]);

  useEffect(() => {
    updateLocation(districtId, districts, "districtId", "district");
  }, [districtId]);

  const { setLocation: setActualLocation } = useActualLocationStore();
  const { mutateAsync: addNewAddress, isPending } =
    useAddNewAddress(accessToken);

  const formik = useFormik<AddNewAddressDialogFormValues>({
    initialValues: {
      addressLabel: "",
      receiverName: "",
      receiverPhoneNumber: "",
      latLon: { lat: 0, lon: 0 },
      addressDetails: "",
      isDefault: false,
      provinceId: "",
      cityId: "",
      districtId: "",
      province: "",
      city: "",
      district: "",
    },
    validationSchema: addNewAddressSchema,
    onSubmit: (values) => {
      if (values.isDefault) {
        setActualLocation(values.latLon.lat, values.latLon.lon);
      }
      addNewAddress(
        { ...values, lat: values.latLon.lat, lon: values.latLon.lon },
        {
          onSuccess: () => {
            setDialogKey((k) => k + 1);
            formik.resetForm();
          },
        },
      );
    },
  });

  const fieldCheckboxProps = (name: keyof AddNewAddressDialogFormValues) => ({
    checked: formik.values[name] as boolean,
    onCheckedChange: (val: boolean) => formik.setFieldValue(name, val),
  });

  return (
    <Dialog
      key={dialogKey}
      onOpenChange={(open) => {
        if (open) {
          setTimeout(() => {
            window.__LEAFLET_MAP__?.invalidateSize();
          }, 350);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full cursor-pointer bg-green-700" type="button">
          Add New Address
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] flex-col sm:max-w-[425px] md:max-w-[600px] lg:max-w-[1000px]">
        {/* Header */}
        <div className="px-6 pt-6">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Fill the form and add new location
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* FORM */}
        <form
          onSubmit={formik.handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* scrollable content */}
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* Address Label */}
              <AddNewAddressDialogFormField
                formik={formik}
                name="addressLabel"
                label="Address Label"
                placeholder="Address Label"
                maxLength={30}
                baseCn={inputBaseCn}
                hint="Home/Apartment/Rumah Selingkuhan/etc."
              />

              {/* Receiver Name + Phone */}
              <div className="flex w-full flex-col space-y-6 space-x-2 sm:flex-row sm:space-y-0">
                <div className="w-full">
                  <AddNewAddressDialogFormField
                    formik={formik}
                    name="receiverName"
                    label="Receiver Name"
                    placeholder="Receiver Name"
                    maxLength={30}
                    baseCn={inputBaseCn}
                    hint="Yadi/Bambang/Sutrisno/etc."
                  />
                </div>
                <div className="w-full">
                  <AddNewAddressDialogFormField
                    formik={formik}
                    name="receiverPhoneNumber"
                    label="Receiver Phone"
                    placeholder="Phone Number"
                    maxLength={25}
                    baseCn={inputBaseCn}
                    hint="08123456789"
                  />
                </div>
              </div>

              {/* MAP */}
              <div className="space-y-1">
                <h1>Pinpoint Location</h1>
                <MapLeaflet
                  onLocationChange={(lat, lon) =>
                    formik.setFieldValue("latLon", { lat, lon })
                  }
                />
                <p className="flex text-xs text-gray-500">
                  Lat: {formik.values.latLon.lat}, Lon:{" "}
                  {formik.values.latLon.lon}
                </p>
              </div>

              {/* Cascading Picker */}
              <RajongSelectGroup
                provinceId={provinceId}
                setProvinceId={setProvinceId}
                cityId={cityId}
                setCityId={setCityId}
                districtId={districtId}
                setDistrictId={setDistrictId}
              />

              {/* Address Details */}
              <AddNewAddressDialogFormField
                formik={formik}
                name="addressDetails"
                label="Address Details"
                placeholder="Details like house number/floor number/etc."
                maxLength={100}
                baseCn={inputBaseCn}
                hint="Perumahan Rumah Blok A No. 1"
              />

              {/* IS DEFAULT? */}
              <div className="space-y-1">
                <div className="flex flex-col gap-6">
                  <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                    <Checkbox
                      id="toggle-2"
                      name="isDefault"
                      {...fieldCheckboxProps("isDefault")}
                      className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-xs leading-none font-medium sm:text-sm">
                        Target this location as my default address
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* fixed footer */}
          <div className="border-t bg-white px-6 py-4">
            <Button
              className="w-full cursor-pointer bg-green-700"
              type="submit"
              disabled={!formik.isValid || !formik.dirty || isPending}
            >
              {isPending ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAddressDialog;
