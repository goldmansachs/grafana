import React, { FC } from 'react';
import { StandardEditorProps } from '@grafana/data';
import {
  ColorPicker,
  Field,
  HorizontalGroup,
  InlineField,
  InlineFieldRow,
  InlineLabel,
  RadioButtonGroup,
} from '@grafana/ui';
import { Observable } from 'rxjs';
import { useObservable } from 'react-use';
import { capitalize } from 'lodash';

import {
  ColorDimensionEditor,
  ResourceDimensionEditor,
  ScaleDimensionEditor,
  ScalarDimensionEditor,
  TextDimensionEditor,
} from 'app/features/dimensions/editors';
import {
  ScaleDimensionConfig,
  ResourceDimensionConfig,
  ColorDimensionConfig,
  ResourceFolderName,
  TextDimensionConfig,
  defaultTextConfig,
  ScalarDimensionConfig,
} from 'app/features/dimensions/types';
import { defaultStyleConfig, GeometryTypeId, StyleConfig, TextAlignment, TextBaseline } from '../../style/types';
import { styleUsesText } from '../../style/utils';
import { LayerContentInfo } from '../../utils/getFeatures';
import { NumberValueEditor } from 'app/core/components/OptionsUI/number';
import { SliderValueEditor } from 'app/core/components/OptionsUI/slider';

export interface StyleEditorOptions {
  layerInfo?: Observable<LayerContentInfo>;
  simpleFixedValues?: boolean;
  displayRotation?: boolean;
}

export const StyleEditor: FC<StandardEditorProps<StyleConfig, StyleEditorOptions, any>> = ({
  value,
  context,
  onChange,
  item,
}) => {
  const settings = item.settings;

  const onSizeChange = (sizeValue: ScaleDimensionConfig | undefined) => {
    onChange({ ...value, size: sizeValue });
  };

  const onSymbolChange = (symbolValue: ResourceDimensionConfig | undefined) => {
    onChange({ ...value, symbol: symbolValue });
  };

  const onColorChange = (colorValue: ColorDimensionConfig | undefined) => {
    onChange({ ...value, color: colorValue });
  };

  const onOpacityChange = (opacityValue: number | undefined) => {
    onChange({ ...value, opacity: opacityValue });
  };

  const onRotationChange = (rotationValue: ScalarDimensionConfig | undefined) => {
    onChange({ ...value, rotation: rotationValue });
  };

  const onTextChange = (textValue: TextDimensionConfig | undefined) => {
    onChange({ ...value, text: textValue });
  };

  const onTextFontSizeChange = (fontSize: number | undefined) => {
    onChange({ ...value, textConfig: { ...value.textConfig, fontSize } });
  };

  const onTextOffsetXChange = (offsetX: number | undefined) => {
    onChange({ ...value, textConfig: { ...value.textConfig, offsetX } });
  };

  const onTextOffsetYChange = (offsetY: number | undefined) => {
    onChange({ ...value, textConfig: { ...value.textConfig, offsetY } });
  };

  const onTextAlignChange = (textAlign: unknown) => {
    onChange({ ...value, textConfig: { ...value.textConfig, textAlign: textAlign as TextAlignment } });
  };

  const onTextBaselineChange = (textBaseline: unknown) => {
    onChange({ ...value, textConfig: { ...value.textConfig, textBaseline: textBaseline as TextBaseline } });
  };

  let featuresHavePoints = false;
  if (settings?.layerInfo) {
    const propertyOptions = useObservable(settings?.layerInfo);
    featuresHavePoints = propertyOptions?.geometryType === GeometryTypeId.Point;
  }
  const hasTextLabel = styleUsesText(value);

  // Simple fixed value display
  if (settings?.simpleFixedValues) {
    return (
      <>
        {featuresHavePoints && (
          <>
            <InlineFieldRow>
              <InlineField label={'Symbol'}>
                <ResourceDimensionEditor
                  value={value?.symbol ?? defaultStyleConfig.symbol}
                  context={context}
                  onChange={onSymbolChange}
                  item={
                    {
                      settings: {
                        resourceType: 'icon',
                        folderName: ResourceFolderName.Marker,
                        placeholderText: hasTextLabel ? 'Select a symbol' : 'Select a symbol or add a text label',
                        placeholderValue: defaultStyleConfig.symbol.fixed,
                        showSourceRadio: false,
                      },
                    } as any
                  }
                />
              </InlineField>
            </InlineFieldRow>
            <Field label={'Rotation angle'}>
              <ScalarDimensionEditor
                value={value?.rotation ?? defaultStyleConfig.rotation}
                context={context}
                onChange={onRotationChange}
                item={
                  {
                    settings: {
                      min: defaultStyleConfig.rotation.min,
                      max: defaultStyleConfig.rotation.max,
                    },
                  } as any
                }
              />
            </Field>
          </>
        )}
        <InlineFieldRow>
          <InlineField label="Color" labelWidth={10}>
            <InlineLabel width={4}>
              <ColorPicker
                color={value?.color?.fixed ?? defaultStyleConfig.color.fixed}
                onChange={(v) => {
                  onColorChange({ fixed: v });
                }}
              />
            </InlineLabel>
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="Opacity" labelWidth={10} grow>
            <SliderValueEditor
              value={value?.opacity ?? defaultStyleConfig.opacity}
              context={context}
              onChange={onOpacityChange}
              item={
                {
                  settings: {
                    min: 0,
                    max: 1,
                    step: 0.1,
                  },
                } as any
              }
            />
          </InlineField>
        </InlineFieldRow>
      </>
    );
  }

  return (
    <>
      <Field label={'Size'}>
        <ScaleDimensionEditor
          value={value?.size ?? defaultStyleConfig.size}
          context={context}
          onChange={onSizeChange}
          item={
            {
              settings: {
                min: 1,
                max: 100,
              },
            } as any
          }
        />
      </Field>
      <Field label={'Symbol'}>
        <ResourceDimensionEditor
          value={value?.symbol ?? defaultStyleConfig.symbol}
          context={context}
          onChange={onSymbolChange}
          item={
            {
              settings: {
                resourceType: 'icon',
                folderName: ResourceFolderName.Marker,
                placeholderText: hasTextLabel ? 'Select a symbol' : 'Select a symbol or add a text label',
                placeholderValue: defaultStyleConfig.symbol.fixed,
                showSourceRadio: false,
              },
            } as any
          }
        />
      </Field>
      <Field label={'Color'}>
        <ColorDimensionEditor
          value={value?.color ?? defaultStyleConfig.color}
          context={context}
          onChange={onColorChange}
          item={{} as any}
        />
      </Field>
      <Field label={'Fill opacity'}>
        <SliderValueEditor
          value={value?.opacity ?? defaultStyleConfig.opacity}
          context={context}
          onChange={onOpacityChange}
          item={
            {
              settings: {
                min: 0,
                max: 1,
                step: 0.1,
              },
            } as any
          }
        />
      </Field>
      {settings?.displayRotation && (
        <Field label={'Rotation angle'}>
          <ScalarDimensionEditor
            value={value?.rotation ?? defaultStyleConfig.rotation}
            context={context}
            onChange={onRotationChange}
            item={
              {
                settings: {
                  min: defaultStyleConfig.rotation.min,
                  max: defaultStyleConfig.rotation.max,
                },
              } as any
            }
          />
        </Field>
      )}
      <Field label={'Text label'}>
        <TextDimensionEditor
          value={value?.text ?? defaultTextConfig}
          context={context}
          onChange={onTextChange}
          item={{} as any}
        />
      </Field>

      {hasTextLabel && (
        <>
          <HorizontalGroup>
            <Field label={'Font size'}>
              <NumberValueEditor
                value={value?.textConfig?.fontSize ?? defaultStyleConfig.textConfig.fontSize}
                context={context}
                onChange={onTextFontSizeChange}
                item={{} as any}
              />
            </Field>
            <Field label={'X offset'}>
              <NumberValueEditor
                value={value?.textConfig?.offsetX ?? defaultStyleConfig.textConfig.offsetX}
                context={context}
                onChange={onTextOffsetXChange}
                item={{} as any}
              />
            </Field>
            <Field label={'Y offset'}>
              <NumberValueEditor
                value={value?.textConfig?.offsetY ?? defaultStyleConfig.textConfig.offsetY}
                context={context}
                onChange={onTextOffsetYChange}
                item={{} as any}
              />
            </Field>
          </HorizontalGroup>
          <Field label={'Align'}>
            <RadioButtonGroup
              value={value?.textConfig?.textAlign ?? defaultStyleConfig.textConfig.textAlign}
              onChange={onTextAlignChange}
              options={[
                { value: TextAlignment.Left, label: capitalize(TextAlignment.Left) },
                { value: TextAlignment.Center, label: capitalize(TextAlignment.Center) },
                { value: TextAlignment.Right, label: capitalize(TextAlignment.Right) },
              ]}
            />
          </Field>
          <Field label={'Baseline'}>
            <RadioButtonGroup
              value={value?.textConfig?.textBaseline ?? defaultStyleConfig.textConfig.textBaseline}
              onChange={onTextBaselineChange}
              options={[
                { value: TextBaseline.Top, label: capitalize(TextBaseline.Top) },
                { value: TextBaseline.Middle, label: capitalize(TextBaseline.Middle) },
                { value: TextBaseline.Bottom, label: capitalize(TextBaseline.Bottom) },
              ]}
            />
          </Field>
        </>
      )}
    </>
  );
};
