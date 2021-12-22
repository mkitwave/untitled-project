import { each, filter, pipe } from '@fxts/core';
import React, { useState } from 'react';
import { GetCategoriesType, TagType } from '../../../../models/data.interface';
import { changeCategoryDataType } from '../CategoryListForm';
import { CategoryListForm, OptionForm, TagListForm } from '../index';
import { changeOptionDataType, OptionDataType } from '../OptionForm';
import * as S from './style';

type OptionDataListType = Array<OptionDataType>;

interface PostCreateType {
  product_name: string;
  product_price: number;
  small_category_id: number;
  tags: Array<TagType>;
  options: OptionDataListType;
}

export interface CreateProps {
  categories_data: GetCategoriesType;
  tags_data: Array<TagType>;
}

export const Create = ({ categories_data, tags_data }: CreateProps) => {
  const [createData, setCreateData] = useState<PostCreateType>({
    product_name: '',
    product_price: 0,
    small_category_id: categories_data.small_categories[0].id,
    tags: [],
    options: [],
  });

  const changeCategoryData: changeCategoryDataType = (selected_small_category_id) => {
    setCreateData({ ...createData, small_category_id: selected_small_category_id });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCreateData({ ...createData, [event.target.name]: event.target.value });
  };

  const [optionDataList, setOptionDataList] = useState<OptionDataListType>([
    {
      name: '',
      option_property_data_list: [],
    },
  ]);

  const addOption = () => {
    setOptionDataList([
      ...optionDataList,
      {
        name: '',
        option_property_data_list: [],
      },
    ]);
  };

  const changeOptionData: changeOptionDataType = (option_number, changed_option_data) => {
    optionDataList[option_number] = changed_option_data;
    setCreateData({ ...createData, options: optionDataList });
  };

  const hasNullValue = () => {
    const input_els = document.querySelectorAll('input');
    pipe(
      input_els,
      filter((el) => el.type !== 'checkbox' && el.placeholder !== 'Search'),
      each((el) => {
        if (!el.value) {
          throw 'Please fill all value! 😔';
        }
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      hasNullValue();
    } catch (e) {
      alert(e);
    }
  };

  return (
    <S.Create>
      <h2>Create New Product</h2>
      <S.CreateForm onSubmit={handleSubmit}>
        <S.FormBox>
          <h3>Categories</h3>
          <CategoryListForm categories_data={categories_data} changeCategoryData={changeCategoryData} />
        </S.FormBox>
        <S.FormBox>
          <h3>Product Name</h3>
          <input type="text" name="product_name" onChange={handleInputChange} />
        </S.FormBox>
        <S.FormBox>
          <h3>Product Price</h3>
          <input type="number" placeholder="0" name="product_price" onChange={handleInputChange} />
        </S.FormBox>
        <S.FormBox>
          <h3>Tags</h3>
          <TagListForm tags_data={tags_data} />
        </S.FormBox>
        <S.FormBox>
          <h3>Options</h3>
          <S.OptionsBox>
            {optionDataList.map((option_data, index) => (
              <OptionForm
                key={`option-form-${index}`}
                option_number={index}
                name={option_data.name}
                option_property_data_list={option_data.option_property_data_list}
                changeOptionData={changeOptionData}
              />
            ))}
          </S.OptionsBox>
          <S.AddOptionBtn type="button" onClick={addOption}>
            +
          </S.AddOptionBtn>
        </S.FormBox>
        <S.CreateBtn type="submit" value="Create" />
      </S.CreateForm>
    </S.Create>
  );
};
