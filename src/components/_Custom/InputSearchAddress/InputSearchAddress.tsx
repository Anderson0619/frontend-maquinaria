import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTranslation from "next-translate/useTranslation";
import { CSSProperties, forwardRef, useEffect, useState } from "react";
import { InputPicker, InputPickerProps, InputProps } from "rsuite";
import useDebounce from "utils/hooks/useDebounce";

const isBrowser = typeof window !== "undefined";
const google = isBrowser ? window.google : null;
const googleService = isBrowser
  ? new google.maps.places.AutocompleteService()
  : null;

export interface IPlace {
  formatted_address: string;
  geometry: { location: IPlaceGeometryLocation };
}

export interface IPlaceGeometryLocation {
  lat: () => number;
  lng: () => number;
}

interface IInputSearchUsers extends InputPickerProps {
  inputStyle?: CSSProperties;
  inputProps?: InputProps;
  inputClassName?: string;
  label?: string;
  error?: any;
  onSelectPlace: (place: IPlace) => void;
}

interface IPrediction {
  description: string;
  place_id: string;
}

const InputSearchAddress = forwardRef<HTMLDivElement, IInputSearchUsers>(
  (props: IInputSearchUsers, ref) => {
    const {
      className,
      style,
      inputClassName,
      inputStyle,
      onChange,
      placeholder,
      onSelectPlace,
      ...inputProps
    } = props;

    const { t } = useTranslation("common");
    const [loading, setLoading] = useState<boolean>(false);
    const [predictions, setPredictions] = useState<IPrediction[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>();
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    const getPlaces = (input: string) => {
      googleService.getPlacePredictions(
        {
          types: ["geocode", "establishment"],
          input,
          componentRestrictions: { country: "CL" },
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            setLoading(false);
            setPredictions(predictions);
          } else {
            setLoading(false);
            setPredictions([]);
          }
        },
      );
    };

    const getPlace = (place_id) => {
      const map = new google.maps.Map(document.createElement("div"));
      const service = new google.maps.places.PlacesService(map);
      service.getDetails(
        {
          placeId: place_id,
          fields: ["formatted_address", "geometry"],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            onSelectPlace(place as IPlace);
          } else {
            console.error("👀 ~ file: InputSearchAddress.tsx", status);
          }
        },
      );
    };

    const handleSearchTerm = (input: string) => {
      if (input.length > 1) {
        setLoading(true);
        setSearchTerm(input);
      } else {
        setLoading(false);
        if (input.length === 0) setPredictions([]);
      }
    };

    useEffect(() => {
      if (debouncedSearchTerm) {
        getPlaces(searchTerm);
      }
    }, [debouncedSearchTerm]);

    return (
      <div {...{ className, style, ref }}>
        <InputPicker
          {...inputProps}
          className={inputClassName}
          style={{ width: "100%", ...inputStyle }}
          onChange={onChange}
          labelKey="description"
          valueKey="place_id"
          placeholder={placeholder}
          menuMaxHeight={120}
          block
          data={predictions}
          onSearch={handleSearchTerm}
          onSelect={getPlace}
          onClean={() => setPredictions([])}
          onClose={() => setPredictions([])}
          onFocus={(event) => {
            event.target.setAttribute("autoComplete", "new-password");
          }}
          renderMenu={(menu) => {
            if (loading) {
              return (
                <p style={{ padding: 4, color: "#999", textAlign: "center" }}>
                  <FontAwesomeIcon icon={faSpinner} spin />{" "}
                  {t("address.searching")}
                </p>
              );
            }
            return menu;
          }}
          renderMenuItem={(label) => (
            <div className="flex items-center">
              <span className="ml-2">{label}</span>
            </div>
          )}
        />
      </div>
    );
  },
);

InputSearchAddress.displayName = "InputSearchAddress";

export default InputSearchAddress;
