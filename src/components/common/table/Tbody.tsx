"use client";

import React from "react";

type TbodyProps = React.ComponentPropsWithoutRef<"tbody">;

export const Tbody: React.FC<TbodyProps> = (props) => <tbody {...props} />;
