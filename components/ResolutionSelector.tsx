import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import { Text } from "./common/Text";
import { type OptionGroup, PlatformDropdown } from "./PlatformDropdown";

export type Resolution = {
  key: string;
  value: number | undefined;
};

export const RESOLUTIONS: Resolution[] = [
  {
    key: "Max",
    value: undefined,
  },
  {
    key: "1080p",
    value: 1080,
  },
  {
    key: "720p",
    value: 720,
  },
  {
    key: "480p",
    value: 480,
  },
  {
    key: "360p",
    value: 360,
  },
].sort(
  (a, b) =>
    (b.value || Number.POSITIVE_INFINITY) -
    (a.value || Number.POSITIVE_INFINITY),
);

interface Props extends React.ComponentProps<typeof View> {
  onChange: (value: Resolution) => void;
  selected?: Resolution | null;
  inverted?: boolean | null;
}

export const ResolutionSelector: React.FC<Props> = ({
  onChange,
  selected,
  inverted,
  ...props
}) => {
  const isTv = Platform.isTV;
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const sorted = useMemo(() => {
    if (inverted)
      return RESOLUTIONS.slice().sort(
        (a, b) =>
          (a.value || Number.POSITIVE_INFINITY) -
          (b.value || Number.POSITIVE_INFINITY),
      );
    return RESOLUTIONS.slice().sort(
      (a, b) =>
        (b.value || Number.POSITIVE_INFINITY) -
        (a.value || Number.POSITIVE_INFINITY),
    );
  }, [inverted]);

  const optionGroups: OptionGroup[] = useMemo(
    () => [
      {
        options: sorted.map((resolution) => ({
          type: "radio" as const,
          label: resolution.key,
          value: resolution,
          selected: resolution.value === selected?.value,
          onPress: () => onChange(resolution),
        })),
      },
    ],
    [sorted, selected, onChange],
  );

  const handleOptionSelect = (optionId: string) => {
    const selectedResolution = sorted.find((r) => r.key === optionId);
    if (selectedResolution) {
      onChange(selectedResolution);
    }
    setOpen(false);
  };

  const trigger = (
    <View className='flex flex-col' {...props}>
      <Text className='opacity-50 mb-1 text-xs'>
        {t("item_card.resolution")}
      </Text>
      <TouchableOpacity
        className='bg-neutral-900 h-10 rounded-xl border-neutral-800 border px-3 py-2 flex flex-row items-center justify-between'
        onPress={() => setOpen(true)}
      >
        <Text numberOfLines={1}>
          {RESOLUTIONS.find((r) => r.value === selected?.value)?.key}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isTv) return null;

  return (
    <PlatformDropdown
      groups={optionGroups}
      trigger={trigger}
      title={t("item_card.resolution")}
      open={open}
      onOpenChange={setOpen}
      onOptionSelect={handleOptionSelect}
      expoUIConfig={{
        hostStyle: { flex: 1 },
      }}
      bottomSheetConfig={{
        enablePanDownToClose: true,
      }}
    />
  );
};
